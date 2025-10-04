import path from "path";
import { setTimeout } from "timers/promises";
import { ZodTypeAny } from "zod";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export interface TransportOptions extends RequestInit {
  query?: Record<string, string>;
}

export interface ExternalApiClientOptions {
  apiHost: string;
  apiPath?: string;
  headers?: Record<string, string>;
  contentType?: string;
  defaultTimeoutSeconds?: number;
  defaultNumRetries?: number;
  secondsBetweenRetries?: number;
}

export class TransportError<T> extends Error {
  public statusCode: number;
  public responseBody: T;
  constructor(
    message: string,
    responseStatus: number,
    responseBody: T = {} as T,
  ) {
    super(message);
    this.name = "TransportError";
    this.statusCode = responseStatus;
    this.responseBody = responseBody;
  }
}

export default abstract class ApiClient<
  Schemas extends Record<string, ZodTypeAny> = Record<string, never>,
> {
  private readonly apiHost: string;
  private readonly apiPath: string;
  private readonly headers?: Record<string, string>;
  private readonly contentType: string;
  private readonly defaultTimeoutSeconds?: number;
  private readonly defaultNumRetries?: number;
  private readonly secondsBetweenRetries: number;

  public schemas: Schemas = {} as Schemas;

  protected constructor({
    apiHost,
    apiPath = "",
    headers = {},
    contentType = "application/json",
    defaultTimeoutSeconds,
    defaultNumRetries,
    secondsBetweenRetries = 1, // default to 1 second between retries
  }: ExternalApiClientOptions) {
    this.apiHost = apiHost;
    this.apiPath = apiPath;
    this.headers = headers;
    this.contentType = contentType;
    this.defaultTimeoutSeconds = defaultTimeoutSeconds;
    this.defaultNumRetries = defaultNumRetries;
    this.secondsBetweenRetries = secondsBetweenRetries;
  }

  private async transport<T, E = unknown>(
    url: string,
    body?: T,
    options: TransportOptions = {},
    timeoutSeconds: number = this.defaultTimeoutSeconds || 0,
    numRetries: number = this.defaultNumRetries || 0,
  ) {
    const apiUrl = new URL(path.join(this.apiPath, url), this.apiHost);
    if (options.query) {
      Object.entries(options.query).forEach(([key, value]) => {
        apiUrl.searchParams.append(key, value);
      });
    }
    let numRetriesRemaining = numRetries;
    while (numRetriesRemaining >= 0) {
      let response: Response;
      try {
        response = await fetch(apiUrl, {
          ...options,
          method: options.method || HTTPMethod.GET,
          headers: {
            ...this.headers,
            ...options.headers,
            "Content-Type": this.contentType,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal:
            timeoutSeconds && timeoutSeconds > 0
              ? AbortSignal.timeout(timeoutSeconds * 1000)
              : options.signal,
        });
      } catch (error) {
        if (numRetriesRemaining === 0) {
          throw error;
        }
        await setTimeout(this.secondsBetweenRetries * 1000);
        numRetriesRemaining--;
        continue;
      }
      if (!response) {
        if (numRetriesRemaining === 0) {
          throw new Error(
            `Error: No response from ${apiUrl} after ${numRetries} retries`,
          );
        }
        await setTimeout(this.secondsBetweenRetries * 1000);
        numRetriesRemaining--;
        continue;
      }
      if (response.ok) {
        if (response.status === 204) {
          return {};
        }
        return await response.json();
      }
      if (numRetriesRemaining === 0) {
        throw new Error(
          `Error ${response.status} from ${apiUrl}: ${await response.text()}`,
        );
      }
      if (response.status === 429) {
        console.log(response.headers.get("Retry-After"));
        await setTimeout(
          1000 *
            parseInt(
              response.headers.get("Retry-After") ||
                this.secondsBetweenRetries.toString(),
            ),
        );
        numRetriesRemaining--;
        continue;
      }
      if (
        response.status === 408 ||
        response.status === 425 ||
        response.status >= 500
      ) {
        await setTimeout(this.secondsBetweenRetries * 1000);
        numRetriesRemaining--;
        continue;
      }
      const errorResponse = (await response.json()) as E;
      if (errorResponse) {
        throw new TransportError<E>(
          `Error ${response.status} from ${apiUrl}: ${JSON.stringify(
            errorResponse,
          )}`,
          response.status,
          errorResponse,
        );
      }
      throw new TransportError(
        `Error ${response.status} from ${apiUrl}: ${await response.text()}`,
        response.status,
      );
    }
  }

  protected getBasicAuthHeader(username: string, password: string) {
    return Buffer.from(username + ":" + password).toString("base64");
  }
  protected get<T, E = unknown>(
    url: string,
    options: TransportOptions = {},
    timeoutSeconds?: number,
    numRetries?: number,
  ) {
    return this.transport<T, E>(
      url,
      undefined,
      {
        method: HTTPMethod.GET,
        ...options,
      },
      timeoutSeconds,
      numRetries,
    ) as Promise<T>;
  }

  protected post<T, E = unknown>(
    url: string,
    body: T,
    options: TransportOptions = {},
    timeoutSeconds?: number,
    numRetries?: number,
  ) {
    return this.transport<T, E>(
      url,
      body,
      {
        method: HTTPMethod.POST,
        ...options,
      },
      timeoutSeconds,
      numRetries,
    );
  }

  protected put<T, E = unknown>(
    url: string,
    body: T,
    options: TransportOptions = {},
    timeoutSeconds?: number,
    numRetries?: number,
  ) {
    return this.transport<T, E>(
      url,
      body,
      {
        method: HTTPMethod.POST,
        ...options,
      },
      timeoutSeconds,
      numRetries,
    );
  }

  protected delete<T = unknown, E = unknown>(
    url: string,
    options: TransportOptions = {},
    timeoutSeconds?: number,
    numRetries?: number,
  ) {
    return this.transport<T, E>(
      url,
      undefined,
      {
        method: HTTPMethod.DELETE,
        ...options,
      },
      timeoutSeconds,
      numRetries,
    );
  }

  protected patch<T, E = unknown>(
    url: string,
    body: T,
    options: TransportOptions = {},
    timeoutSeconds?: number,
    numRetries?: number,
  ) {
    return this.transport<T, E>(
      url,
      body,
      {
        method: HTTPMethod.PATCH,
        ...options,
      },
      timeoutSeconds,
      numRetries,
    );
  }
}
