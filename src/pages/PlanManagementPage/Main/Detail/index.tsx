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
  IconCalendar,
  IconMapPin,
  IconPlant,
  IconEdit,
  IconTrash,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const PlanManagementMainDetailPage = () => {
  const navigate = useNavigate();
  const plan = {
    season: "Mùa Xuân 2025",
    startDate: "01/03/2025",
    endDate: "30/06/2025",
    zone: "Vùng A",
    area: "Khu vực A1",
    plot: "Lô A1-L1",
    row: "Hàng 1",
    growthStage: "Ra hoa",
    materials: [
      { item: "Phân NPK", quantity: 10 },
      { item: "Vôi bột", quantity: 5 },
    ],
    equipment: [
      { item: "Máy xịt", quantity: 2 },
      { item: "Bình tưới", quantity: 3 },
    ],
    pesticides: [{ item: "Confidor", quantity: 4 }],
  };
  return (
    <Card withBorder radius={8} p="lg" shadow="sm">
      <Group mb="md" align="center" justify="space-between">
        <Group mb={"md"}>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết kế hoạch mùa vụ</Title>
        </Group>
        <Group>
          <Button radius={4} leftSection={<IconEdit size={16} />}>
            Chỉnh sửa
          </Button>
          <Button radius={4} color="red" leftSection={<IconTrash size={16} />}>
            Xoá
          </Button>
        </Group>
      </Group>

      <Stack gap="sm">
        <Title order={4}>Thông tin mùa vụ</Title>
        <Group>
          <Badge
            leftSection={<IconCalendar size={12} />}
            radius={4}
            color="teal"
          >
            {plan.season}
          </Badge>
          <Badge radius={4} color="blue">
            {plan.startDate} - {plan.endDate}
          </Badge>
        </Group>

        <Divider my="sm" />

        <Title order={4}>Khu vực thực hiện</Title>
        <Group gap="md">
          <Badge radius={4} leftSection={<IconMapPin size={12} />}>
            {plan.zone}
          </Badge>
          <Badge radius={4}>{plan.area}</Badge>
          <Badge radius={4}>{plan.plot}</Badge>
          <Badge radius={4}>{plan.row}</Badge>
        </Group>

        <Divider my="sm" />

        <Title order={4}>Giai đoạn và vật tư</Title>
        <Badge radius={4} leftSection={<IconPlant size={12} />} color="grape">
          {plan.growthStage}
        </Badge>

        <Stack mt="xs">
          <Title order={5}>Vật tư ({plan.materials.length})</Title>
          {plan.materials.map((m, i) => (
            <Text key={i}>
              - {m.item}: {m.quantity}
            </Text>
          ))}
        </Stack>

        <Stack>
          <Title order={5}>Thiết bị ({plan.equipment.length})</Title>
          {plan.equipment.map((e, i) => (
            <Text key={i}>
              - {e.item}: {e.quantity}
            </Text>
          ))}
        </Stack>

        <Stack>
          <Title order={5}>Thuốc BVTV ({plan.pesticides.length})</Title>
          {plan.pesticides.map((p, i) => (
            <Text key={i}>
              - {p.item}: {p.quantity}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default PlanManagementMainDetailPage;
