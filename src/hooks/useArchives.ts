import { useServerFn } from "@tanstack/react-start";
import { getServerArchive } from "@/gameState.ts";
import { useQuery } from "@tanstack/react-query";

export const useArchives = () => {
  const getArchives = useServerFn(getServerArchive);
  return useQuery({
    queryKey: ["archives"],
    queryFn: () => getArchives(),
  });
};
