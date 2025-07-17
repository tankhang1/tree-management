import {
  Card,
  Group,
  Stack,
  Text,
  Divider,
  Badge,
  Grid,
  Paper,
} from "@mantine/core";
import {
  IconClipboardText,
  IconUser,
  IconUsersGroup,
  IconMapPin,
  IconCalendarEvent,
  IconFileDescription,
  IconBox,
  IconTool,
  IconVaccine,
} from "@tabler/icons-react";

const UnPlannedDetail = () => {
  const data = {
    name: "Phun thuốc sâu vụ hè",
    manager: "Nguyễn Quản Lý",
    supervisor: "Lê Kiểm Tra",
    plan: "Không có kế hoạch cụ thể",
    season: "Mùa Hè 2025",
    cycle: "Chu kỳ 1",
    stage: "Gieo trồng",
    departments: ["Chăm sóc cây", "Phòng BVTV"],
    employees: ["Nguyễn Văn A", "Trần Thị B"],
    resources: [
      { type: "Vật tư", name: "Phân NPK", quantity: 5, unit: "kg" },
      { type: "Thuốc BVTV", name: "Confidor", quantity: 3, unit: "chai" },
    ],
  };

  return (
    <Stack>
      <Card withBorder p="md" radius="md">
        <Stack gap={8}>
          <Group align="center">
            <IconClipboardText size={18} />
            <Text fw={500}>Tên công việc:</Text>
            <Text>{data.name}</Text>
          </Group>
          <Group align="center">
            <IconCalendarEvent size={18} />
            <Text fw={500}>Mùa vụ:</Text>
            <Text>{data.season}</Text>
          </Group>
          <Group align="center">
            <IconFileDescription size={18} />
            <Text fw={500}>Kế hoạch:</Text>
            <Text>{data.plan}</Text>
          </Group>
          <Group align="center">
            <IconUser size={18} />
            <Text fw={500}>Người quản lý:</Text>
            <Text>{data.manager}</Text>
          </Group>
          <Group align="center">
            <IconUser size={18} />
            <Text fw={500}>Người kiểm định chất lượng:</Text>
            <Text>{data.supervisor}</Text>
          </Group>
          <Group align="center">
            <IconMapPin size={18} />
            <Text fw={500}>Chu kỳ sinh trưởng:</Text>
            <Text>{data.cycle}</Text>
          </Group>
          <Group align="center">
            <IconMapPin size={18} />
            <Text fw={500}>Giai đoạn sinh trưởng:</Text>
            <Text>{data.stage}</Text>
          </Group>
          <Group align="center" wrap="wrap">
            <IconUsersGroup size={18} />
            <Text fw={500}>Phòng ban tham gia:</Text>
            <Group gap={4}>
              {data.departments.map((d, i) => (
                <Badge key={i}>{d}</Badge>
              ))}
            </Group>
          </Group>
          <Group align="center" wrap="wrap">
            <IconUsersGroup size={18} />
            <Text fw={500}>Nhân sự tham gia:</Text>
            <Group gap={4}>
              {data.employees.map((e, i) => (
                <Badge key={i}>{e}</Badge>
              ))}
            </Group>
          </Group>
        </Stack>
      </Card>

      <Divider label="Tài sản sử dụng" labelPosition="center" my="md" />
      <Card withBorder p="md" radius="md">
        <Grid gutter="sm">
          {data.resources.map((r, i) => (
            <Grid.Col span={{ base: 12, sm: 6 }} key={i}>
              <Paper withBorder p="sm" radius="md">
                <Stack gap={2}>
                  <Group gap={4}>
                    {r.type === "Vật tư" && <IconBox size={16} />}
                    {r.type === "Thuốc BVTV" && <IconVaccine size={16} />}
                    {r.type === "Thiết bị" && <IconTool size={16} />}
                    <Text fw={500}>{r.type}</Text>
                  </Group>
                  <Text>{r.name}</Text>
                  <Text>
                    {r.quantity} {r.unit}
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
    </Stack>
  );
};

export default UnPlannedDetail;
