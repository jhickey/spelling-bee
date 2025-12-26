import { InputLabel, ListSubheader, MenuItem, Select } from "@mui/material";
import { rankingLevels } from "@/constants";

interface SettingRankSelectProps {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
}

export default function SettingRankSelect({
  label,
  name,
  value,
  onChange,
  onBlur,
}: SettingRankSelectProps) {
  return (
    <>
      <InputLabel id="settings-starting-letter-hints">{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value={-1}>Always</MenuItem>
        <MenuItem value={99}>Never</MenuItem>
        <ListSubheader component="div">Ranks</ListSubheader>
        {rankingLevels.map((level) => (
          <MenuItem key={level.index} value={level.index}>
            {level.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
