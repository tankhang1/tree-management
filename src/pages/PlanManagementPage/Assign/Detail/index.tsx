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
import { useNavigate } from "react-router-dom";

const PlanManagementAssignDetailPage = () => {
  const navigate = useNavigate();

  const data = {
    name: "Tưới nước đợt 1",
    startDate: "2025-07-02",
    endDate: "2025-07-03",
    departments: ["Chăm sóc cây", "Thu hoạch"],
    employees: ["Nguyễn Văn A", "Trần Thị B"],
    manager: "Nguyễn Quản Lý",
    supervisor: "",
    seasonPlan: "Mùa Hè 2025",
    stages: [
      {
        cycle: "Chu kỳ 1",
        stage: "Gieo trồng",
        leader: "Nguyễn Văn A",
        members: ["Nguyễn Văn A", "Trần Thị B"],
        resources: [
          { name: "Phân NPK", quantity: 5, unit: "Kg" },
          { name: "Thuốc trừ sâu A", quantity: 2, unit: "Lít" },
        ],
      },
      {
        cycle: "Chu kỳ 2",
        stage: "Ra hoa",
        leader: "Trần Thị B",
        members: ["Trần Thị B"],
        resources: [
          { name: "Thuốc trừ cỏ B", quantity: 3, unit: "Lít" },
          { name: "Máy bơm nước", quantity: 1 },
        ],
      },
    ],
  };

  return (
    <Stack justify="center" align="center">
      <Card w="100%" withBorder shadow="md" radius={8} p="xl">
        <Group mb="md">
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết công việc canh tác</Title>
        </Group>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={500}>Tên công việc:</Text>
            <Text>{data.name}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Thời gian thực hiện:</Text>
            <Text>{data.startDate}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Thời gian hoàn thành dự kiến:</Text>
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
            <Text fw={500}>Nhân sự thực hiện:</Text>
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
            <Text>{data.manager || "--"}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Người kiểm định chất lượng:</Text>
            <Text>{data.supervisor || "--"}</Text>
          </Group>

          <Group justify="space-between">
            <Text fw={500}>Kế hoạch mùa vụ:</Text>
            <Text>{data.seasonPlan}</Text>
          </Group>

          <Divider
            my="sm"
            label="Chi tiết theo chu kỳ & giai đoạn"
            labelPosition="left"
          />

          {data.stages.map((s, idx) => (
            <Card key={idx} withBorder radius={8} p="md">
              <Title order={5}>
                {s.cycle} – {s.stage}
              </Title>

              <Text mt={4}>
                <b>Trưởng nhóm:</b> {s.leader || "--"}
              </Text>
              <Text mt={4}>
                <b>Thành viên:</b> {s.members.join(", ") || "--"}
              </Text>

              <Text mt={4} fw={600}>
                Tài nguyên:
              </Text>
              {s.resources.map((r, i) => (
                <Group key={i} justify="space-between" pl="md">
                  <Text>- {r.name}</Text>
                  <Text>
                    {r.quantity} {r.unit || ""}
                  </Text>
                </Group>
              ))}
            </Card>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
};

export default PlanManagementAssignDetailPage;
