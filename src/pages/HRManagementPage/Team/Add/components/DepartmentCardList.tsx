import {
  Card,
  Stack,
  Text,
  Group,
  Badge,
  SimpleGrid,
  Title,
} from "@mantine/core";

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
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {departments.map((dept) => (
        <Card key={dept.code} withBorder radius="md" shadow="xs" p="md">
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
    </SimpleGrid>
  );
}
