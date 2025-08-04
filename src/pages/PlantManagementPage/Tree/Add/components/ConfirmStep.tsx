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
        <Group grow align="flex-start">
          <Stack>
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
              <Text fw={500}>Loại cây:</Text>
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

          <Stack justify="center" align="center">
            <Image
              w={300}
              h={300}
              src={data.image}
              radius="md"
              alt="Ảnh cây trồng"
            />
          </Stack>
        </Group>
      </Card>

      <Divider label="Chu kỳ sinh trưởng" labelPosition="center" my="md" />

      <Group wrap="nowrap" gap="md">
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
      </Group>
      <Divider
        label="Danh sách tài liệu kỹ thuật"
        labelPosition="center"
        my="md"
      />
      <Group>
        <Card radius={4} withBorder shadow="xs" flex={1}>
          <Stack>
            <Text fw={"bold"}>Kỹ thuật canh tác</Text>
            <Text size="sm" c="dimmed">
              Hướng dẫn chi tiết về cách trồng và chăm sóc cây sầu riêng giống
              Ri6, bao gồm các bước từ chuẩn bị đất, gieo hạt, tưới tiêu, và bón
              phân.
            </Text>
            <a
              href="https://example.com/ky-thuat-canh-tac.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text color="blue" size="sm">
                Tải xuống tài liệu kỹ thuật canh tác
              </Text>
            </a>
          </Stack>
        </Card>
        <Card radius={4} withBorder shadow="xs" flex={1}>
          <Stack>
            <Text fw={"bold"}>Tiêu chuẩn chất lượng</Text>
            <Text size="sm" c="dimmed">
              Các tiêu chuẩn chất lượng cần đạt được cho cây sầu riêng giống
              Ri6, bao gồm kích thước trái, trọng lượng, và hàm lượng dinh
              dưỡng.
            </Text>
            <a
              href="https://example.com/tieu-chuan-chat-luong.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text color="blue" size="sm">
                Tải xuống tài liệu tiêu chuẩn chất lượng
              </Text>
            </a>
          </Stack>
        </Card>
        <Card radius={4} withBorder shadow="xs" flex={1}>
          <Stack>
            <Text fw={"bold"}>Giải pháp phòng trừ sâu bệnh</Text>
            <Text size="sm" c="dimmed">
              Hướng dẫn chi tiết về cách phòng trừ sâu bệnh cho cây sầu riêng
              giống Ri6, bao gồm các loại thuốc bảo vệ thực vật và phương pháp
              sử dụng an toàn.
            </Text>
            <a
              href="https://example.com/phong-tru-sau-benh.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text color="blue" size="sm">
                Tải xuống tài liệu giải pháp phòng trừ sâu bệnh
              </Text>
            </a>
          </Stack>
        </Card>
      </Group>
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
