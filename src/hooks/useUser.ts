import { useServerFn } from "@tanstack/react-start";
import { getServerUser, updateServerUserSettings } from "@/serverFns.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSettings } from "@/schemas/database.ts";

const USER_QUERY_KEY = "user";

export const useUser = () => {
  const queryClient = useQueryClient();
  const getUser = useServerFn(getServerUser);
  const updateSettings = useServerFn(updateServerUserSettings);
  const query = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: () => getUser(),
  });
  const mutation = useMutation({
    mutationFn: (data: UserSettings) => updateSettings({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
  return {
    ...query,
    updateSettings: mutation,
  };
};
