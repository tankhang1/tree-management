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
import { IconArrowLeft } from "@tabler/icons-react";
import lodash from "lodash";
import { useNavigate } from "react-router-dom";

const PlanManagementAssignDetailPage = () => {
  const navigate = useNavigate();
  const data = {
    name: "Tưới nước đợt 1",
    assignDate: "2025-07-01",
    startDate: "2025-07-02",
    endDate: "2025-07-03",
    departments: ["Chăm sóc cây", "Thu hoạch"],
    employees: ["Nguyễn Văn A", "Trần Thị B"],
    manager: "Nguyễn Quản Lý",
    supervisor: "Trần Thanh Tra",
    seasonPlan: "Mùa Hè 2025",
    resources: [
      { type: "Vật tư", name: "Phân NPK", quantity: 5 },
      { type: "Vật tư", name: "Vôi bột", quantity: 10 },
      { type: "Thuốc BVTV", name: "Thuốc trừ sâu A", quantity: 2, unit: "Lít" },
      { type: "Thuốc BVTV", name: "Thuốc trừ cỏ B", quantity: 3, unit: "Lít" },
      { type: "Thiết bị", name: "Máy bơm nước", quantity: 1 },
      { type: "Thiết bị", name: "Xe phun thuốc", quantity: 2 },
    ],
  };
  const groupResources = lodash.groupBy(data.resources, "type");
  return (
    <Stack justify="center" align="center">
      <Card w={"50%"} withBorder shadow="md" radius={8} p="xl">
        <Group mb={"md"}>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết phiếu giao việc</Title>
        </Group>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={500}>Tên phiếu:</Text>
            <Text>{data.name}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Thời gian giao việc:</Text>
            <Text>{data.assignDate}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Bắt đầu:</Text>
            <Text>{data.startDate}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Kết thúc:</Text>
            <Text>{data.endDate}</Text>
          </Group>

          <Group justify="space-between" align="start">
            <Text fw={500}>Phòng ban:</Text>
            <Group>
              {data.departments.map((dept) => (
                <Badge key={dept} color="blue" variant="light">
                  {dept}
                </Badge>
              ))}
            </Group>
          </Group>

          <Group justify="space-between" align="start">
            <Text fw={500}>Nhân sự:</Text>
            <Group>
              {data.employees.map((e) => (
                <Badge key={e} color="green" variant="light">
                  {e}
                </Badge>
              ))}
            </Group>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Người quản lý:</Text>
            <Text>{data.manager}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Người giám sát:</Text>
            <Text>{data.supervisor}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Kế hoạch canh tác:</Text>
            <Text>{data.seasonPlan}</Text>
          </Group>

          <Divider my="sm" label="Tài nguyên sử dụng" labelPosition="left" />

          <Stack>
            {Object.entries(groupResources).map(([type, items]) => (
              <Stack key={type} gap={4} mt="sm">
                <Text fw={600} c="dimmed">
                  {type}
                </Text>
                {items.map((r, idx) => (
                  <Group key={idx} justify="space-between" pl="md">
                    <Text>- {r.name}</Text>
                    <Text>
                      {r.quantity} {r.unit || ""}
                    </Text>
                  </Group>
                ))}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default PlanManagementAssignDetailPage;
