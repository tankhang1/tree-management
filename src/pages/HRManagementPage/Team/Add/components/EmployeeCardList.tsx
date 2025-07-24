import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Image,
  ScrollArea,
} from "@mantine/core";

const employees = [
  {
    id: "EMP001",
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    dob: "1990-05-10",
    role: "Kỹ sư canh tác",
    level: "Trưởng nhóm",
    department: "Phòng Nông Nghiệp",
    status: "Đang hoạt động",
    manager: "Lê Thị B",
  },
  //   {
  //     id: "EMP002",
  //     username: "phamthib",
  //     fullName: "Phạm Thị B",
  //     dob: "1995-11-20",
  //     role: "Giám sát hiện trường",
  //     level: "Nhân viên",
  //     department: "Phòng Kỹ Thuật",
  //     status: "Thử việc",
  //     manager: "Nguyễn Văn A",
  //   },
];

function getStatusColor(status: string) {
  return status === "Đang hoạt động"
    ? "green"
    : status === "Thử việc"
    ? "yellow"
    : "gray";
}

export function EmployeeCardList() {
  return (
    <ScrollArea>
      <Group>
        {employees.map((emp) => (
          <Card w={300} key={emp.id} withBorder radius="md" shadow="xs" p="md">
            <Group align="flex-start" gap="md">
              <Image
                src={
                  "https://cdn.prod.website-files.com/5fbb9b89508062592a9731b1/6448c1ce35d6ffe59e4d6f46_GettyImages-1399565382.jpg"
                }
                w={60}
                height={60}
                radius={100}
              />
              <Stack gap={4} style={{ flex: 1 }}>
                <Group justify="space-between">
                  <Text fw={600}>{emp.fullName}</Text>
                  <Badge color={getStatusColor(emp.status)}>{emp.status}</Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  Mã nhân sự:{" "}
                  <Text span fw={500}>
                    {emp.id}
                  </Text>
                </Text>
                <Text size="sm" c="dimmed">
                  Tài khoản:{" "}
                  <Text span fw={500}>
                    {emp.username}
                  </Text>
                </Text>
                <Text size="sm" c="dimmed">
                  Ngày sinh:{" "}
                  <Text span fw={500}>
                    {emp.dob}
                  </Text>
                </Text>
                <Text size="sm" c="dimmed">
                  Vai trò:{" "}
                  <Text span fw={500}>
                    {emp.role}
                  </Text>
                </Text>
                <Text size="sm" c="dimmed">
                  Cấp bậc:{" "}
                  <Text span fw={500}>
                    {emp.level}
                  </Text>
                </Text>
                <Text size="sm" c="dimmed">
                  Phòng ban:{" "}
                  <Text span fw={500}>
                    {emp.department}
                  </Text>
                </Text>
                <Text size="sm" c="dimmed">
                  Người quản lý:{" "}
                  <Text span fw={500}>
                    {emp.manager}
                  </Text>
                </Text>
              </Stack>
            </Group>
          </Card>
        ))}
      </Group>
    </ScrollArea>
  );
}
