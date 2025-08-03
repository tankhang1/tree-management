import { Card, Stack, Text, Group, Badge, Title } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";

const departments = [
  {
    code: "PB-KT",
    name: "Phòng Kỹ thuật",
    description: "Phụ trách kỹ thuật canh tác và máy móc",
    createdAt: "2024-06-01",
    updatedAt: "2025-01-15",
  },
  {
    code: "PB-NC",
    name: "Phòng Nghiên cứu",
    description: "Nghiên cứu giống cây trồng và phân tích đất",
    createdAt: "2024-06-10",
    updatedAt: "2025-03-10",
  },
  {
    code: "PB-TCHC",
    name: "Phòng Tổ chức Hành chính",
    description: "Quản lý nhân sự, hành chính",
    createdAt: "2024-07-01",
    updatedAt: "2025-04-22",
  },
];

export function DepartmentCardList() {
  return (
    <Scrollable h={150}>
      <Group wrap="nowrap" gap={"md"} p={"xs"}>
        {departments.map((dept) => (
          <Card
            h={130}
            miw={300}
            key={dept.code}
            withBorder
            radius="md"
            shadow="xs"
            p="md"
            style={{ position: "relative", transition: "transform 0.2s ease" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Stack gap="xs">
              <Group justify="space-between">
                <Title order={5}>{dept.name}</Title>
                <Badge variant="light" color="gray">
                  {dept.code}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                {dept.description}
              </Text>
              <Group justify="space-between" mt="xs">
                <Text size="xs" c="dimmed">
                  Ngày tạo:{" "}
                  <Text span fw={500}>
                    {dept.createdAt}
                  </Text>
                </Text>
                <Text size="xs" c="dimmed">
                  Cập nhật:{" "}
                  <Text span fw={500}>
                    {dept.updatedAt}
                  </Text>
                </Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
}
