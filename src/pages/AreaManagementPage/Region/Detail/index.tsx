import {
  Card,
  Text,
  Title,
  Divider,
  Badge,
  Grid,
  Group,
  Paper,
  ThemeIcon,
  Button,
  SegmentedControl,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconDroplet,
  IconRulerMeasure,
  IconTree,
  IconUserCog,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapBox from "./components/Map";
const AreaManagementRegionDetailPage = () => {
  const [type, setType] = useState<string>("Toạ độ");
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      region: {
        codeSystem: "R001",
        codeGov: "VN-REG-2025",
        name: "Vùng trồng sầu riêng Đồng Nai",
        orgUnit: "Hộ nông dân Nguyễn Văn A",
        employee: "Nhân viên A",
        area: "10000",
        soilType: "Đất thịt",
        terrain: ["Cao", "Dốc"],
        gps: "10.123,106.234;10.124,106.235;...",
        note: "Vùng có địa hình dốc nhẹ",
      },
      areas: [
        {
          code: "KV001",
          name: "Khu vực phía Bắc",
          area: "4500",
          soilType: "Đất thịt",
          terrain: ["Cao"],
          mainCrop: "Sầu riêng",
          gps: "10.12,106.21;...",
          manager: "Khang",
          plots: [],
        },
        {
          code: "KV002",
          name: "Khu vực phía Nam",
          area: "5500",
          soilType: "Đất thịt",
          terrain: ["Dốc"],
          mainCrop: "Sầu riêng",
          gps: "10.14,106.23;...",
          manager: "Khang",
          plots: [],
        },
      ],
    },
  });

  const region = useMemo(() => form.values.region, [form.values.region]);
  const areas = useMemo(() => form.values.areas, [form.values.areas]);

  return (
    <Card withBorder shadow="md" radius={8} p="xl">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}> Chi tiết vùng trồng</Title>
      </Group>
      <Grid gutter="md" mb="xl">
        <Grid.Col span={6}>
          <Grid>
            <Grid.Col span={6}>
              <Text fw={500}>Mã vùng:</Text>
              <Text>{region.codeSystem}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Mã định danh nhà nước:</Text>
              <Text>{region.codeGov}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Tên vùng trồng:</Text>
              <Text>{region.name}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Đơn vị quản lý:</Text>
              <Text>{region.orgUnit}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Người quản lý:</Text>
              <Text>{region.employee}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Diện tích:</Text>
              <Text>{region.area} m²</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Loại đất:</Text>
              <Text>{region.soilType}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Địa hình:</Text>
              <Group>
                {region.terrain.map((t, i) => (
                  <Badge key={i}>{t}</Badge>
                ))}
              </Group>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text fw={500}>Ghi chú:</Text>
              <Text>{region.note}</Text>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack>
            <SegmentedControl
              radius={4}
              data={["Toạ độ", "Bản đồ"]}
              value={type}
              onChange={(value) => setType(value)}
            />
            {type === "Toạ độ" && (
              <iframe
                title="Bản đồ vùng trồng"
                src="https://maps.google.com/maps?q=10.123,106.234&z=15&output=embed"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: 8 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            )}
            {type === "Bản đồ" && (
              <Stack h={400} w={"100%"}>
                <MapBox />
              </Stack>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      <Divider my="md" label="Danh sách khu vực (2)" labelPosition="left" />

      <Grid gutter="md">
        {areas.map((area, idx) => (
          <Grid.Col span={6} key={idx}>
            <Paper withBorder shadow="xs" radius={8} p="md">
              <Group mb="xs">
                <Title order={5}>{area.name}</Title>
                <Badge color="green">{area.code}</Badge>
              </Group>
              <Group mb={8}>
                <ThemeIcon variant="light" color="blue" size={24}>
                  <IconRulerMeasure size={16} />
                </ThemeIcon>
                <Text size="sm">{area.area} m²</Text>
              </Group>
              <Group mb={8}>
                <ThemeIcon variant="light" color="orange" size={24}>
                  <IconDroplet size={16} />
                </ThemeIcon>
                <Text size="sm">{area.soilType}</Text>
              </Group>
              <Group mb={8}>
                <ThemeIcon variant="light" color="teal" size={24}>
                  <IconTree size={16} />
                </ThemeIcon>
                <Text size="sm">{area.mainCrop}</Text>
              </Group>
              <Group mb={8}>
                <ThemeIcon variant="light" color="grape" size={24}>
                  <IconUserCog size={16} />
                </ThemeIcon>
                <Text size="sm">{area.manager}</Text>
              </Group>
              <Group gap="xs" mt="sm">
                {area.terrain.map((t, i) => (
                  <Badge key={i} size="xs" color="gray" variant="light">
                    {t}
                  </Badge>
                ))}
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Card>
  );
};

export default AreaManagementRegionDetailPage;
