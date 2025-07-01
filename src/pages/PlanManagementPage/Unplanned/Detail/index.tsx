import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconUser,
  IconUsers,
  IconClipboardList,
  IconToolsKitchen2,
  IconVaccine,
  IconTool,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlanManagementUnplannedDetailPage = () => {
  const navigate = useNavigate();
  const [assignment] = useState({
    name: "Phun thuốc trừ sâu đợt 1",
    startDate: new Date("2025-07-02"),
    endDate: new Date("2025-07-04"),
    departments: ["Chăm sóc cây", "Phòng BVTV"],
    employees: ["Nguyễn Văn A", "Trần Thị B"],
    creator: "Nguyễn Quản Lý",
    supervisor: "", // optional
    seasonPlan: "", // optional
    resources: [
      { type: "Vật tư", name: "Phân bón A", quantity: 20, unit: "Kg" },
      { type: "Thuốc BVTV", name: "Thuốc trừ sâu X", quantity: 5, unit: "Lít" },
      { type: "Thiết bị", name: "Bình xịt", quantity: 2, unit: "Cái" },
    ],
  });

  const groupResources = (type: string) =>
    assignment.resources.filter((r) => r.type === type);

  return (
    <Stack justify="center" align="center">
      <Card w="60%" withBorder shadow="sm" radius={8} p="xl">
        <Group mb="md">
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết công việc phát sinh</Title>
        </Group>

        <Stack gap="sm">
          <Group gap={6} align="center">
            <IconClipboardList size={18} />
            <Text fw={500}>Tên công việc:</Text>
            <Text>{assignment.name}</Text>
          </Group>

          <Group grow>
            <Group gap={6}>
              <IconCalendarEvent size={18} />
              <Text fw={500}>Thời gian thực hiện:</Text>
              <Text>{assignment.startDate.toLocaleDateString()}</Text>
            </Group>
            <Group gap={6}>
              <IconCalendarEvent size={18} />
              <Text fw={500}>Thời gian hoàn thành dự kiến:</Text>
              <Text>{assignment.endDate.toLocaleDateString()}</Text>
            </Group>
          </Group>

          <Group gap={6} align="center">
            <IconUsers size={18} />
            <Text fw={500}>Phòng ban:</Text>
            <Group>
              {assignment.departments.map((d, i) => (
                <Badge key={i}>{d}</Badge>
              ))}
            </Group>
          </Group>

          <Group gap={6} align="center">
            <IconUser size={18} />
            <Text fw={500}>Nhân sự:</Text>
            <Group>
              {assignment.employees.map((e, i) => (
                <Badge key={i} color="blue">
                  {e}
                </Badge>
              ))}
            </Group>
          </Group>

          <Group gap={6}>
            <IconUser size={18} />
            <Text fw={500}>Người tạo:</Text>
            <Text>{assignment.creator}</Text>
          </Group>

          <Group gap={6}>
            <IconUser size={18} />
            <Text fw={500}>Người kiểm định:</Text>
            <Text>{assignment.supervisor || "--"}</Text>
          </Group>

          <Group gap={6}>
            <IconClipboardList size={18} />
            <Text fw={500}>Kế hoạch mùa vụ:</Text>
            <Text>{assignment.seasonPlan || "--"}</Text>
          </Group>

          <Divider label="Tài nguyên sử dụng" labelPosition="left" my="sm" />

          {[
            {
              label: "Vật tư",
              icon: <IconToolsKitchen2 size={18} color="gray" />,
            },
            {
              label: "Thuốc BVTV",
              icon: <IconVaccine size={18} color="pink" />,
            },
            {
              label: "Thiết bị",
              icon: <IconTool size={18} color="orange" />,
            },
          ].map(({ label, icon }) => {
            const items = groupResources(label);
            return items.length > 0 ? (
              <Stack key={label} gap={4} mt="sm">
                <Group gap={6}>
                  {icon}
                  <Text fw={600}>{label}</Text>
                </Group>
                {items.map((r, i) => (
                  <Group key={i} justify="space-between">
                    <Text>{r.name}</Text>
                    <Text>
                      {r.quantity} {r.unit}
                    </Text>
                  </Group>
                ))}
              </Stack>
            ) : null;
          })}
        </Stack>
      </Card>
    </Stack>
  );
};

export default PlanManagementUnplannedDetailPage;
