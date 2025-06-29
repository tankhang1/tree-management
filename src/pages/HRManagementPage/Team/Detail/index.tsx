import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBuildingBank,
  IconId,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const HRManagementTeamDetailPage = () => {
  const navigate = useNavigate();
  const group = {
    id: "group-001",
    name: "Nhóm Kỹ Thuật Canh Tác",
    description: "Nhóm phụ trách kỹ thuật trồng trọt và chăm sóc cây trồng.",
    departments: ["Phòng Nông Nghiệp", "Phòng Kỹ Thuật"],
    roles: ["Trưởng nhóm", "Nhân viên kỹ thuật"],
    members: [
      {
        id: "u001",
        name: "Nguyễn Văn A",
        email: "a.nguyen@example.com",
        role: "Trưởng nhóm",
        department: "Phòng Kỹ Thuật",
      },
      {
        id: "u001",
        name: "Nguyễn Văn A",
        email: "a.nguyen@example.com",
        role: "Trưởng nhóm",
        department: "Phòng Kỹ Thuật",
      },
      {
        id: "u001",
        name: "Nguyễn Văn A",
        email: "a.nguyen@example.com",
        role: "Trưởng nhóm",
        department: "Phòng Kỹ Thuật",
      },
      {
        id: "u001",
        name: "Nguyễn Văn A",
        email: "a.nguyen@example.com",
        role: "Trưởng nhóm",
        department: "Phòng Kỹ Thuật",
      },
      {
        id: "u002",
        name: "Trần Thị B",
        email: "b.tran@example.com",
        role: "Nhân viên kỹ thuật",
        department: "Phòng Nông Nghiệp",
      },
    ],
  };
  return (
    <Stack justify="center" align="center">
      <Card w={"60%"} withBorder radius={4} p="xl" shadow="sm">
        <Stack gap="lg">
          <Group mb={"md"}>
            <Button
              variant="subtle"
              radius={4}
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title order={3}>👥 Thông tin nhóm</Title>
          </Group>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Text fw={600}>Tên nhóm</Text>
              <Text size="sm" c="dimmed">
                {group.name}
              </Text>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Mô tả</Text>
              <Text size="sm" c="dimmed">
                {group.description || "(Trống)"}
              </Text>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Phòng ban liên quan</Text>
              <Group>
                {group.departments?.map((dep: string, idx: number) => (
                  <Badge key={idx} color="blue" variant="light">
                    <Group gap={2}>
                      <IconBuildingBank size={12} style={{ marginRight: 4 }} />{" "}
                      {dep}
                    </Group>
                  </Badge>
                ))}
              </Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Vai trò</Text>
              <Group>
                {group.roles?.map((role: string, idx: number) => (
                  <Badge key={idx} color="grape" variant="light">
                    <Group gap={2}>
                      <IconId size={12} style={{ marginRight: 4 }} /> {role}
                    </Group>
                  </Badge>
                ))}
              </Group>
            </Grid.Col>
          </Grid>

          <Divider
            label={<Text fw={600}>📋 Danh sách thành viên</Text>}
            labelPosition="left"
            my="sm"
          />
          <Stack>
            {group.members?.map((user, idx) => (
              <Group key={idx} justify="space-between">
                <Group gap={2}>
                  <IconUser size={18} />
                  <Text>{user.name}</Text>
                </Group>
                <Group>
                  <Badge color="gray" variant="light">
                    {user?.role}
                  </Badge>
                  <Badge color="blue" variant="light">
                    {user?.department}
                  </Badge>
                </Group>
              </Group>
            ))}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default HRManagementTeamDetailPage;
