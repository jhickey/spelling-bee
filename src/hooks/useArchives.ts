import { useServerFn } from "@tanstack/react-start";
import { getServerArchive } from "@/serverFns.ts";
import { useQuery } from "@tanstack/react-query";

export const useArchives = () => {
  const getArchives = useServerFn(getServerArchive);
  return useQuery({
    queryKey: ["archives"],
    queryFn: () => getArchives(),
  });
};
