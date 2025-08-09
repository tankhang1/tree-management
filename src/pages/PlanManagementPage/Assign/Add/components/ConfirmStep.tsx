import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  Badge,
  Image,
  ThemeIcon,
} from "@mantine/core";
import {
  IconMapPin,
  IconClipboardText,
  IconLayersSubtract,
  IconClockHour4,
  IconPaperclip,
  IconUser,
  IconFileText,
  IconUsers,
  IconAsset,
  IconBox,
  IconTool,
  IconVaccine,
  IconCar,
} from "@tabler/icons-react";
import Scrollable from "../../../../../components/Scrollable";

const ConfirmStep = () => {
  const data = {
    name: "Tưới nước đợt 1",
    manager: "Nguyễn Quản Lý",
    supervisor: "Trần Thanh Tra",
    plan: "KH-XUAN-01",
    season: "Mùa Xuân 2025",
    treeGroup: "Cây ngắn ngày",
    treeCategory: "Rau cải",
    crop: "Rau muống",
    cropCode: "RAU-001",
    cropVariety: "Rau muống lá nhỏ",
    cropSeed: "RMLN-2025",
    cropImage:
      "https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg",
    cropDescription:
      "Loại rau muống sinh trưởng nhanh, phù hợp với vùng đất ẩm. Có thể thu hoạch sau 45 ngày.",
    harvestUnit: "kg",
    duration: 45,
    zone: "Vùng Đồng Bằng",
    area: "Khu vực A1",
    plot: "Lô số 3",
    cycles: [
      {
        name: "Chu kỳ 1",
        stages: [
          {
            name: "Gieo hạt",
            duration: 5,
            documentType: "file",
            document: "Tài liệu gieo hạt.pdf",
            materials: ["Phân NPK"],
            equipment: ["Bình tưới"],
            pesticides: [],
            leader: "Nguyễn Văn A",
            members: ["Nguyễn Văn A", "Trần Thị B"],
            resources: [
              { type: "Phân bón", amount: 5, unit: "kg" },
              { type: "Thiết bị", amount: 1, unit: "cái" },
            ],
          },
          {
            name: "Ra lá",
            duration: 10,
            documentType: "editor",
            document: "Giai đoạn ra lá cần đủ ánh sáng và độ ẩm",
            materials: ["Vôi bột"],
            equipment: ["Máy xịt"],
            pesticides: ["Confidor"],
            leader: "Trần Thị B",
            members: ["Lê Văn C"],
            resources: [{ type: "Thuốc BVTV", amount: 3, unit: "chai" }],
          },
        ],
      },
    ],
  };

  return (
    <Stack>
      <Title order={3}>Xác nhận kế hoạch canh tác</Title>

      <Group grow align="flex-start">
        <Card withBorder h={250}>
          <Group flex={1} align="flex-start">
            <Stack flex={1} gap={4}>
              <Group>
                <Text fw={500}>Tên công việc:</Text>
                <Text>{data.name}</Text>
              </Group>
              <Group>
                <Text fw={500}>Mùa vụ:</Text>
                <Text>{data.season}</Text>
              </Group>
              <Group>
                <Text fw={500}>Kế hoạch:</Text>
                <Text>{data.plan}</Text>
              </Group>
              <Group>
                <Text fw={500}>Người quản lý:</Text>
                <Text>{data.manager}</Text>
              </Group>
              <Group>
                <Text fw={500}>Người kiểm định chất lượng:</Text>
                <Text>{data.supervisor}</Text>
              </Group>

              <Group>
                <Text fw={500}>Thời gian thực hiện dự kiến:</Text>
                <Text>15/2/2025</Text>
              </Group>
              <Group>
                <Text fw={500}>Thời gian hoàn thành dự kiến:</Text>
                <Text>19/2/2025</Text>
              </Group>
            </Stack>
            <Stack flex={1} gap={"xs"}>
              <Group>
                <IconMapPin size={16} />
                <Text>{data.zone}</Text>
              </Group>
              <Group>
                <IconLayersSubtract size={16} />
                <Text>{data.area}</Text>
              </Group>
              <Group>
                <IconClipboardText size={16} />
                <Text>{data.plot}</Text>
              </Group>
            </Stack>
          </Group>
        </Card>
        <Card withBorder h={250}>
          <Group grow align="flex-start">
            <Stack>
              <Group>
                <Text fw={500}>Cây trồng:</Text>
                <Text>Sầu riêng</Text>
              </Group>
              <Group>
                <Text fw={500}>Giống cây:</Text>
                <Text>Sầu riêng Ri6</Text>
              </Group>
              <Group>
                <Text fw={500}>Hạt giống:</Text>
                <Text>{data.cropSeed}</Text>
              </Group>
              <Group>
                <Text fw={500}>Đơn vị thu hoạch:</Text>
                <Text>{data.harvestUnit}</Text>
              </Group>
            </Stack>
            <Image
              src={data.cropImage}
              h={210}
              radius="md"
              alt="Ảnh cây trồng"
            />
          </Group>
        </Card>
      </Group>

      <Divider
        label="Danh sách chu kỳ và giai đoạn"
        labelPosition="center"
        my="md"
      />

      {data.cycles.map((cycle, cycleIdx) => (
        <Stack key={cycleIdx} gap="lg">
          <Title order={3}>{cycle.name}</Title>

          <Group>
            {cycle.stages.map((stage, stageIdx) => (
              <Card
                w={400}
                h={500}
                key={stageIdx}
                shadow="sm"
                withBorder
                radius="md"
                p="md"
              >
                <Stack gap="xs">
                  {/* Header */}
                  <Group justify="space-between" align="center">
                    <Group>
                      <ThemeIcon color="blue" variant="light" radius="md">
                        <IconClockHour4 size={18} />
                      </ThemeIcon>
                      <Text fw={600}>
                        {stage.name} ({stage.duration} ngày)
                      </Text>
                    </Group>
                    <Badge variant="light" color="blue">
                      {cycle.name}
                    </Badge>
                  </Group>

                  {/* Tài liệu */}

                  {/* Trưởng nhóm */}
                  <Divider label="Trưởng nhóm" labelPosition="left" />
                  <Group>
                    <ThemeIcon color="teal" variant="light" radius="md">
                      <IconUser size={16} />
                    </ThemeIcon>
                    <Text size="sm">{stage.leader}</Text>
                  </Group>

                  {/* Nhân sự */}
                  <Divider label="Nhân sự" labelPosition="left" />
                  <Group gap={6}>
                    <ThemeIcon color="indigo" variant="light" radius="md">
                      <IconUsers size={16} />
                    </ThemeIcon>
                    {stage.members.map((member, i) => (
                      <Badge key={i} color="indigo" variant="light">
                        {member}
                      </Badge>
                    ))}
                  </Group>

                  {/* Tài sản */}
                  <Divider label="Hạng mục sử dụng" labelPosition="left" />

                  <Title order={4} size="h6">
                    Phân bón
                  </Title>
                  <Scrollable>
                    <Group gap={4} wrap="nowrap">
                      {[
                        { type: "Phân bón NPK", amount: 100, unit: "kg" },
                        { type: "Phân bón hữu cơ", amount: 50, unit: "kg" },
                        { type: "Phân bón lá", amount: 20, unit: "l" },
                      ].map((res, i) => (
                        <Card w={210} withBorder radius={4} shadow="sm">
                          <Group key={i}>
                            <ThemeIcon color="cyan" variant="light" radius="md">
                              <IconAsset size={16} />
                            </ThemeIcon>
                            <Text size="sm">
                              {res.type}: {res.amount} {res.unit || ""}
                            </Text>
                          </Group>
                        </Card>
                      ))}
                    </Group>
                  </Scrollable>
                  <Title order={4} size="h6">
                    Máy móc
                  </Title>
                  <Scrollable>
                    <Group gap={4} wrap="nowrap">
                      {[
                        { type: "Máy cày", amount: 1, unit: "cái" },
                        { type: "Máy kéo", amount: 1, unit: "cái" },
                        { type: "Máy phun thuốc", amount: 1, unit: "cái" },
                      ].map((res, i) => (
                        <Card w={210} withBorder radius={4} shadow="sm">
                          <Group key={i}>
                            <ThemeIcon
                              color="green"
                              variant="light"
                              radius="md"
                            >
                              <IconCar size={16} />
                            </ThemeIcon>
                            <Text size="sm">
                              {res.type}: {res.amount} {res.unit || ""}
                            </Text>
                          </Group>
                        </Card>
                      ))}
                    </Group>
                  </Scrollable>
                </Stack>
              </Card>
            ))}
          </Group>
        </Stack>
      ))}
    </Stack>
  );
};

export default ConfirmStep;
