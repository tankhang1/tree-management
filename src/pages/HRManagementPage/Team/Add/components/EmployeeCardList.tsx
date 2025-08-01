import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Image,
  ScrollArea,
  ActionIcon,
  Divider,
  Tooltip,
} from "@mantine/core";
import { IconTrash, IconUser } from "@tabler/icons-react";

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
];

function getStatusColor(status: string) {
  return status === "Đang hoạt động"
    ? "green"
    : status === "Thử việc"
    ? "yellow"
    : "gray";
}

type TEmployeeCard = {
  isDelete?: boolean;
};

export function EmployeeCardList({ isDelete = false }: TEmployeeCard) {
  return (
    <ScrollArea>
      <Group gap="lg" align="flex-start" wrap="wrap" p="xs">
        {employees.map((emp) => (
          <Card
            key={emp.id}
            withBorder
            radius="md"
            shadow="sm"
            p="md"
            style={{
              width: 320,
              position: "relative",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Group align="flex-start" gap="md">
              <Image
                src={
                  "https://cdn.prod.website-files.com/5fbb9b89508062592a9731b1/6448c1ce35d6ffe59e4d6f46_GettyImages-1399565382.jpg"
                }
                w={70}
                h={70}
                radius={4}
                alt="Employee Avatar"
              />
              <Stack gap={4} style={{ flex: 1 }}>
                <Group justify="space-between">
                  <Text fw={600} size="lg">
                    {emp.fullName}
                  </Text>
                  <Badge color={getStatusColor(emp.status)}>{emp.status}</Badge>
                </Group>
                <Divider my="xs" />
                <Text size="sm" c="dimmed">
                  <b>Mã nhân sự:</b> {emp.id}
                </Text>
                <Text size="sm" c="dimmed">
                  <b>Tài khoản:</b> {emp.username}
                </Text>
                <Text size="sm" c="dimmed">
                  <b>Ngày sinh:</b> {emp.dob}
                </Text>
                <Text size="sm" c="dimmed">
                  <b>Vai trò:</b> {emp.role}
                </Text>
                <Text size="sm" c="dimmed">
                  <b>Cấp bậc:</b> {emp.level}
                </Text>
                <Text size="sm" c="dimmed">
                  <b>Phòng ban:</b> {emp.department}
                </Text>
                <Text size="sm" c="dimmed">
                  <b>Người quản lý:</b> {emp.manager}
                </Text>
              </Stack>
            </Group>
            {isDelete && (
              <Tooltip label="Xóa nhân sự" position="top" withArrow>
                <ActionIcon
                  pos="absolute"
                  variant="light"
                  color="red"
                  right={16}
                  top={16}
                  radius={4}
                >
                  <IconTrash size={19} />
                </ActionIcon>
              </Tooltip>
            )}
          </Card>
        ))}
      </Group>
    </ScrollArea>
  );
}
