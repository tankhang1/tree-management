import { Card, Text, Group, Badge, Checkbox } from "@mantine/core";
import { useState } from "react";
import Scrollable from "../../../../../components/Scrollable";

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
    description: "Nghiên cứu và phát triển sản phẩm mới",
    departments: ["Phòng Nghiên cứu", "Phòng Phát triển"],
    roles: ["Nghiên cứu viên", "Phát triển sản phẩm"],
    members: [
      { name: "Phạm Thị D", role: "Trưởng nhóm" },
      { name: "Nguyễn Văn E", role: "Nhân viên" },
    ],
  },
  {
    name: "Nhóm Kinh doanh",
    description: "Phụ trách bán hàng và chăm sóc khách hàng",
    departments: ["Phòng Kinh doanh", "Phòng Chăm sóc khách hàng"],
    roles: ["Nhân viên kinh doanh", "Chăm sóc khách hàng"],
    members: [
      { name: "Trần Văn F", role: "Trưởng nhóm" },
      { name: "Lê Thị G", role: "Nhân viên" },
    ],
  },
  {
    name: "Nhóm Marketing",
    description: "Quảng bá sản phẩm và xây dựng thương hiệu",
    departments: ["Phòng Marketing"],
    roles: ["Chuyên viên Marketing", "Thiết kế"],
    members: [
      { name: "Nguyễn Thị H", role: "Trưởng nhóm" },
      { name: "Phạm Văn I", role: "Nhân viên" },
    ],
  },
  {
    name: "Nhóm Hành chính",
    description: "Quản lý hành chính và nhân sự",
    departments: ["Phòng Hành chính", "Phòng Nhân sự"],
    roles: ["Hành chính", "Nhân sự"],
    members: [
      { name: "Lê Văn J", role: "Trưởng nhóm" },
      { name: "Nguyễn Thị K", role: "Nhân viên" },
    ],
  },
  {
    name: "Nhóm IT",
    description: "Quản lý hệ thống công nghệ thông tin",
    departments: ["Phòng IT"],
    roles: ["Quản trị hệ thống", "Phát triển phần mềm"],
    members: [
      { name: "Trần Văn L", role: "Trưởng nhóm" },
      { name: "Phạm Thị M", role: "Nhân viên" },
    ],
  },
  {
    name: "Nhóm Tài chính",
    description: "Quản lý tài chính và kế toán",
    departments: ["Phòng Tài chính", "Phòng Kế toán"],
    roles: ["Kế toán", "Tài chính"],
    members: [
      { name: "Nguyễn Văn N", role: "Trưởng nhóm" },
      { name: "Lê Thị O", role: "Nhân viên" },
    ],
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
    <Scrollable h={180}>
      <Group wrap="nowrap" gap="md" p={"xs"}>
        {teamData.map((team) => (
          <Card
            key={team.name}
            shadow="sm"
            padding="lg"
            radius={4}
            miw={350}
            h={150}
            withBorder
            style={{
              borderColor: selected.includes(team.name) ? "green" : undefined,
            }}
            onClick={() => toggleSelection(team.name)}
          >
            <Group justify="apart" mb="xs">
              {isCheckbox && (
                <Checkbox
                  radius={4}
                  checked={selected.includes(team.name)}
                  onChange={() => {}}
                  readOnly
                />
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

            {/* <Text size="xs" fw={500}>
            Vai trò:
          </Text>
          <Group gap={4} mb={4}>
            {team.roles.map((r) => (
              <Badge key={r} color="green" variant="light">
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
          </Group> */}
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
}
