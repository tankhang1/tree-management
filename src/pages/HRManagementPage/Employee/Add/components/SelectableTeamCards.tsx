import { Card, Text, Group, Badge, Checkbox } from "@mantine/core";
import { useState } from "react";

const teamData = [
  {
    name: "Nhóm Canh tác",
    description: "Phụ trách chăm sóc và giám sát cây trồng",
    departments: ["Phòng Canh tác", "Phòng Giám sát"],
    roles: ["Giám sát", "Kỹ thuật"],
    members: [
      { name: "Nguyễn Văn A", role: "Trưởng nhóm" },
      { name: "Trần Thị B", role: "Nhân viên" },
    ],
  },
  {
    name: "Nhóm Vật tư",
    description: "Theo dõi kho và phân phối vật tư",
    departments: ["Phòng Vật tư"],
    roles: ["Kho", "Cung ứng"],
    members: [{ name: "Lê Văn C", role: "Nhân viên kho" }],
  },
  {
    name: "Nhóm Phát triển",
    description: "Theo dõi kho và phân phối vật tư",
    departments: ["Phòng Vật tư"],
    roles: ["Kho", "Cung ứng"],
    members: [{ name: "Lê Văn C", role: "Nhân viên kho" }],
  },
];
type TSelectableTeamCards = {
  isCheckbox?: boolean;
};
export function SelectableTeamCards({
  isCheckbox = true,
}: TSelectableTeamCards) {
  // State to manage selected teams
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <Group grow>
      {teamData.map((team) => (
        <Card
          key={team.name}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{
            borderColor: selected.includes(team.name) ? "green" : undefined,
          }}
          onClick={() => toggleSelection(team.name)}
        >
          <Group justify="apart" mb="xs">
            {isCheckbox && (
              <Checkbox checked={selected.includes(team.name)} readOnly />
            )}
            <Text fw={600}>{team.name}</Text>
          </Group>

          <Text size="sm" mb="sm">
            {team.description}
          </Text>

          <Text size="xs" fw={500}>
            Phòng ban:
          </Text>
          <Group gap={4} mb={4}>
            {team.departments.map((d) => (
              <Badge key={d} color="blue" variant="light">
                {d}
              </Badge>
            ))}
          </Group>

          <Text size="xs" fw={500}>
            Vai trò:
          </Text>
          <Group gap={4} mb={4}>
            {team.roles.map((r) => (
              <Badge key={r} color="teal" variant="light">
                {r}
              </Badge>
            ))}
          </Group>

          <Text size="xs" fw={500}>
            Thành viên:
          </Text>
          <Group gap={4} mt={4}>
            {team.members.map((m) => (
              <Badge key={m.name} color="gray" variant="filled">
                {m.name} ({m.role})
              </Badge>
            ))}
          </Group>
        </Card>
      ))}
    </Group>
  );
}
