// components/SelectableTeamCards.tsx
import { Card, Text, Group, Badge, Checkbox } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import { useTeamStore } from "../../../../zustand/teamStore";

type SelectableTeamCardsProps = {
  isCheckbox?: boolean;
  selectedIds?: string[]; // Danh sách ID đã chọn từ cha
  onToggle?: (id: string) => void; // Hàm callback khi click
};

export function SelectableTeamCards({
  isCheckbox = true,
  selectedIds = [],
  onToggle = () => {},
}: SelectableTeamCardsProps) {
  const { teams } = useTeamStore(); // Lấy dữ liệu từ store thật

  return (
    <Scrollable h={180}>
      <Group wrap="nowrap" gap="md" p={"xs"}>
        {teams.map((team) => (
          <Card
            key={team.id}
            shadow="sm"
            padding="lg"
            radius={4}
            miw={350}
            h={150}
            withBorder
            style={{
              borderColor: selectedIds.includes(team.id) ? "green" : undefined,
              cursor: isCheckbox ? "pointer" : "default",
            }}
            onClick={() => isCheckbox && onToggle(team.id)}
          >
            <Group justify="space-between" mb="xs">
              <Text fw={600}>{team.name}</Text>

              {isCheckbox && (
                <Checkbox
                  radius={4}
                  checked={selectedIds.includes(team.id)}
                  onChange={() => {}} // Handle click on Card level
                  readOnly
                  style={{ pointerEvents: "none" }}
                />
              )}
            </Group>

            <Text size="sm" mb="sm" lineClamp={2}>
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
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
}
