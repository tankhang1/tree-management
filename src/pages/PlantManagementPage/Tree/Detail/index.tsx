import {
  Badge,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Image,
  Grid,
  Paper,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLeaf,
  IconDroplet,
  IconCalendarTime,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const PlantManagementTreeDetailPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      id: "CT002",
      name: "Đậu nành",
      type: "Cây công nghiệp ngắn ngày",
      note: "Phù hợp với đất phù sa, cần ánh sáng tốt và thoát nước vừa phải.",
      seedCode: "DN-GV01",
      seedName: "Giống Đậu nành GV01",
      supplier: "Viện Nghiên cứu Cây trồng Trung ương",
      origin: "Việt Nam",
      germinationRate: "90",
      yield: "2.5",
      seedNote:
        "Giống có khả năng chịu hạn tốt, năng suất cao và hàm lượng protein lớn.",
      seedDoc: null,
      harvestMethod: "Theo lứa",
      growthCycle: "Ngắn (3-4 tháng)",
      growthStages: [
        "Gieo hạt",
        "Nảy mầm",
        "Sinh trưởng thân lá",
        "Ra hoa",
        "Kết quả",
        "Thu hoạch",
      ],
      growthTime: "120",
      growthNote:
        "Cần tưới nước đều giai đoạn ra hoa và kết quả; hạn chế sâu cuốn lá và rệp đậu.",
    },
  });

  return (
    <Card withBorder shadow="md" radius={4} p="xl">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3} c="green.8">
          🌳 Chi tiết cây trồng
        </Title>
      </Group>

      <Grid gutter={40}>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Image
            src="https://dantocmiennui-media.baotintuc.vn/images/84426cb421b40f0fbef0009243df48a99534fe2adafef46ae8b1255b38d3094e9ca2f8f3dda56bf19250d37f31511823a865ffe4c6980715d772b87cdb48f7eb/3873TT1.jpg"
            radius="md"
            h={350}
            alt="Hình ảnh cây trồng"
            fit="contain"
          />
          <Paper p="sm" radius={4} withBorder mt="md">
            <Text size="lg" fw={600} mb={4}>
              Thông tin chung
            </Text>
            <Group justify="space-between">
              <Text>Mã cây:</Text>
              <Text>{form.values.id}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Tên cây:</Text>
              <Text>{form.values.name}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Loại cây:</Text>
              <Badge color="green" size="sm">
                {form.values.type}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text>Ghi chú:</Text>
              <Text>{form.values.note}</Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Divider
              label={
                <Group>
                  <IconLeaf size={16} /> Thông tin hạt giống
                </Group>
              }
              labelPosition="left"
            />

            <Paper p="sm" radius={4} withBorder>
              <Group justify="space-between">
                <Text>Mã giống:</Text>
                <Text>{form.values.seedCode}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Tên giống:</Text>
                <Text>{form.values.seedName}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Nhà cung cấp:</Text>
                <Text>{form.values.supplier}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Xuất xứ:</Text>
                <Text>{form.values.origin}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Tỷ lệ nảy mầm:</Text>
                <Text>{form.values.germinationRate}%</Text>
              </Group>
              <Group justify="space-between">
                <Text>Năng suất:</Text>
                <Text>{form.values.yield} tấn/ha</Text>
              </Group>
              <Group align="flex-start">
                <Text>Mô tả:</Text>
                <Text>{form.values.seedNote}</Text>
              </Group>
            </Paper>

            <Divider
              label={
                <Group>
                  <IconDroplet size={16} /> Hình thức thu hoạch
                </Group>
              }
              labelPosition="left"
            />

            <Paper p="sm" radius={4} withBorder>
              <Group justify="space-between">
                <Text>Phương pháp:</Text>
                <Text>{form.values.harvestMethod}</Text>
              </Group>
            </Paper>

            <Divider
              label={
                <Group>
                  <IconCalendarTime size={16} /> Chu kỳ sinh trưởng
                </Group>
              }
              labelPosition="left"
            />

            <Paper p="sm" radius={4} withBorder>
              <Group justify="space-between">
                <Text>Chu kỳ:</Text>
                <Text>{form.values.growthCycle}</Text>
              </Group>
              <Group align="center" justify="space-between">
                <Text mr="sm">Giai đoạn:</Text>
                <Group gap={4}>
                  {form.values.growthStages.map((s, i) => (
                    <Badge key={i} size="xs" variant="light">
                      {s}
                    </Badge>
                  ))}
                </Group>
              </Group>
              <Group justify="space-between">
                <Text>Thời gian:</Text>
                <Text>{form.values.growthTime} ngày</Text>
              </Group>
              <Group justify="space-between" align="flex-start">
                <Text>Điều kiện đặc thù:</Text>
                <Text>{form.values.growthNote}</Text>
              </Group>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default PlantManagementTreeDetailPage;
