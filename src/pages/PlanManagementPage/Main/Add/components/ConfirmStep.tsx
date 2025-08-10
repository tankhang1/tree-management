import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  SimpleGrid,
} from "@mantine/core";
import {
  IconMapPin,
  IconClipboardText,
  IconLayersSubtract,
} from "@tabler/icons-react";
import SeedDetailCards from "../../../../AreaManagementPage/Region/Add/components/SeedDetailCards";
import GrowthStageCard from "./GrowthStageCard";

const ConfirmStep = () => {
  const data = {
    season: "Mùa Xuân 2025",
    treeGroup: "Cây ngắn ngày",
    treeCategory: "Rau cải",
    crop: "Sầu riêng",
    cropCode: "RAU-001",
    cropVariety: "Sầu riêng Ri6",
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
    cycleName: "Chu kỳ 1", // <-- đổi ở đây nếu cần
    stages: [
      {
        name: "Gieo hạt",
        duration: 5,
        documentType: "file",
        document: "Tài liệu gieo hạt.pdf",
        materials: ["Phân NPK"],
        equipment: ["Bình tưới"],
        pesticides: [],
      },
      {
        name: "Ra lá",
        duration: 10,
        documentType: "editor",
        document: "Giai đoạn ra lá cần đủ ánh sáng và độ ẩm",
        materials: ["Vôi bột"],
        equipment: ["Máy xịt"],
        pesticides: ["Confidor"],
      },
    ],
  };

  // helper: chuyển array tên -> [{ item, quantity }]
  const toItems = (arr?: string[]) =>
    (arr || []).map((name) => ({ item: name, quantity: 1 }));

  return (
    <Stack>
      <Title order={3}>Xác nhận kế hoạch canh tác</Title>

      {/* Thông tin tổng quan */}
      <Group grow>
        <Card withBorder>
          <Stack gap={4}>
            <Group>
              <Text fw={500}>Kế hoạch:</Text>
              <Text>
                {data.crop} - {data.cropVariety} (Mã: {data.cropCode})
              </Text>
            </Group>
            <Group>
              <Text fw={500}>Mùa vụ:</Text>
              <Text>{data.season}</Text>
            </Group>
            <Group>
              <Text fw={500}>Thời gian chu kỳ:</Text>
              <Text>{data.duration} ngày</Text>
            </Group>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap={4}>
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
        </Card>
      </Group>

      <Divider label="Danh sách hạt giống" labelPosition="center" my="md" />
      <SeedDetailCards isTouchable={false} />

      <Divider label="Danh sách giai đoạn" labelPosition="center" my="md" />

      <Card withBorder radius={4} shadow="sm" p="md">
        <Stack>
          <Text fw="bold">{data.cycleName}</Text>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {data.stages.map((s) => (
              <GrowthStageCard
                key={s.name}
                stageName={`${s.name} (${s.duration} ngày)`}
                materials={toItems(s.materials)}
                equipment={toItems(s.equipment)}
                pesticides={toItems(s.pesticides)}
                // Nếu GrowthStageCard có props hiển thị tài liệu:
                // documentType={s.documentType as "file" | "editor"}
                // document={s.document}
                mode="view"
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Card>
    </Stack>
  );
};

export default ConfirmStep;
