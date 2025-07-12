import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  Badge,
  Grid,
  Image,
} from "@mantine/core";
import {
  IconMapPin,
  IconPlant2,
  IconListNumbers,
  IconRepeat,
  IconClockHour4,
} from "@tabler/icons-react";

const ConfirmStep = () => {
  const data = {
    region: "Vùng trồng A",
    area: "Khu vực B",
    plot: "Lô C",
    farmingMethod: "Hữu cơ",
    treeGroup: "Cây ăn trái",
    treeCategory: "Sầu riêng",
    treeVariety: "Giống Ri6",
    treeCode: "CAY-SR-0001",
    seed: "Hạt giống SR-RI6",
    irrigation: "Tưới nhỏ giọt",
    image:
      "https://sauriengoi.vn/wp-content/uploads/2023/08/AdobeStock-93Q2EVldRH-e1697079899709.jpg",
    description:
      "Cây sầu riêng giống Ri6, sinh trưởng tốt ở vùng đất bazan, năng suất cao.",
    unit: "kg/trái",
    growthCycles: [
      {
        name: "Chu kỳ 1",
        stages: [
          { name: "Gieo hạt", duration: 15 },
          { name: "Ra lá", duration: 30 },
        ],
      },
      {
        name: "Chu kỳ 2",
        stages: [
          { name: "Ra hoa", duration: 20 },
          { name: "Đậu quả", duration: 40 },
        ],
      },
    ],
    rows: [
      {
        name: "Hàng 1",
        variety: "Giống Ri6",
        treeCount: 5,
        gps: [
          { lat: 10.762622, lng: 106.660172 },
          { lat: 10.7628, lng: 106.6603 },
        ],
      },
      {
        name: "Hàng 2",
        variety: "Giống Ri6",
        treeCount: 3,
        gps: [{ lat: 10.7629, lng: 106.6605 }],
      },
    ],
  };

  return (
    <Stack mt={"md"}>
      <Title order={3}>Xác nhận thông tin cây trồng</Title>

      <Card withBorder>
        <Group align="flex-start">
          <Stack flex={1}>
            <Group>
              <Text fw={500}>Vùng trồng:</Text>
              <Text>{data.region}</Text>
            </Group>
            <Group>
              <Text fw={500}>Khu vực:</Text>
              <Text>{data.area}</Text>
            </Group>
            <Group>
              <Text fw={500}>Lô:</Text>
              <Text>{data.plot}</Text>
            </Group>
            <Group>
              <Text fw={500}>Phương pháp canh tác:</Text>
              <Text>{data.farmingMethod}</Text>
            </Group>
            <Group>
              <Text fw={500}>Nhóm cây:</Text>
              <Text>{data.treeGroup}</Text>
            </Group>
            <Group>
              <Text fw={500}>Danh mục cây:</Text>
              <Text>{data.treeCategory}</Text>
            </Group>
            <Group>
              <Text fw={500}>Giống cây:</Text>
              <Text>{data.treeVariety}</Text>
            </Group>
            <Group>
              <Text fw={500}>Mã cây:</Text>
              <Text>{data.treeCode}</Text>
            </Group>
            <Group>
              <Text fw={500}>Hạt giống:</Text>
              <Text>{data.seed}</Text>
            </Group>
            <Group>
              <Text fw={500}>Phương pháp tưới tiêu:</Text>
              <Text>{data.irrigation}</Text>
            </Group>
            <Group>
              <Text fw={500}>Đơn vị tính thu hoạch:</Text>
              <Text>{data.unit}</Text>
            </Group>
            <Group>
              <Text fw={500}>Mô tả:</Text>
              <Text>{data.description}</Text>
            </Group>
          </Stack>
          {data.image && (
            <Group justify="center" align="center">
              <Image
                flex={1}
                src={data.image}
                radius="md"
                alt="Ảnh cây trồng"
              />
            </Group>
          )}
        </Group>
      </Card>

      <Divider label="Chu kỳ sinh trưởng" labelPosition="center" my="md" />

      <Stack>
        {data.growthCycles.map((cycle, idx) => (
          <Card withBorder key={idx} shadow="xs">
            <Stack>
              <Group>
                <IconRepeat size={18} />
                <Text fw={600}>{cycle.name}</Text>
              </Group>
              {cycle.stages.map((stage, sIdx) => (
                <Group key={sIdx} pl={24}>
                  <IconClockHour4 size={16} />
                  <Text size="sm">
                    {stage.name} - {stage.duration} ngày
                  </Text>
                </Group>
              ))}
            </Stack>
          </Card>
        ))}
      </Stack>

      <Divider label="Danh sách hàng" labelPosition="center" my="md" />

      <Grid>
        {data.rows.map((row, index) => (
          <Grid.Col span={6} key={index}>
            <Card shadow="xs" withBorder>
              <Stack>
                <Group justify="apart">
                  <Text fw={600}>{row.name}</Text>
                  <Badge
                    color="green"
                    leftSection={<IconListNumbers size={14} />}
                  >
                    {row.treeCount} cây{" "}
                  </Badge>
                </Group>
                <Group>
                  <IconPlant2 size={18} />
                  <Text size="sm">{row.variety}</Text>
                </Group>
                <Group>
                  <IconMapPin size={18} />
                  <Stack gap={2}>
                    {row.gps.map((point, i) => (
                      <Text size="xs" key={i}>
                        Lat: {point.lat}, Lng: {point.lng}
                      </Text>
                    ))}
                  </Stack>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};

export default ConfirmStep;
