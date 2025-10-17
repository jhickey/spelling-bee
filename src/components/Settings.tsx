import { useForm } from "@tanstack/react-form";
import { Container, FormControl, Stack, Typography } from "@mui/material";
import SettingRankSelect from "@/components/Settings/SettingRankSelect";
import { useUser } from "@/hooks/useUser.ts";

export default function Settings() {
  const { isPending, isError, data, updateSettings } = useUser();

  const form = useForm({
    defaultValues: {
      showStartingLetterHints: data?.settings.showStartingLetterHints ?? 0,
      showRemainingLetterHints: data?.settings.showRemainingLetterHints ?? 0,
    },
    onSubmit: async ({ value }) => {
      updateSettings.mutate({
        ...data?.settings,
        ...value,
      });
    },
    listeners: {
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) {
          formApi.handleSubmit();
        }
      },
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading settings</div>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Stack spacing={2}>
          <FormControl fullWidth>
            <form.Field
              name="showStartingLetterHints"
              children={(field) => {
                return (
                  <SettingRankSelect
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(val) => field.handleChange(val)}
                    label="Show Starting Letter Hints"
                  />
                );
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <form.Field
              name="showRemainingLetterHints"
              children={(field) => {
                return (
                  <SettingRankSelect
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(val) => field.handleChange(val)}
                    label="Show Remaining Letter Hints"
                  />
                );
              }}
            />
          </FormControl>
        </Stack>
      </form>
    </Container>
  );
}
