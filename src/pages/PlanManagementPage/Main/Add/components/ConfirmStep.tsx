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

  return (
    <Stack>
      <Title order={3}>Xác nhận kế hoạch canh tác</Title>

      <Group grow>
        <Card withBorder>
          <Stack gap={4}>
            <Group>
              <Text fw={500}>Kế hoạch:</Text>
              <Text>Kế hoạch trồng sầu riêng</Text>
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
          <Text fw={"bold"}>Chu kì 2</Text>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            <GrowthStageCard
              stageName="Giai đoạn Nảy mầm"
              materials={[
                {
                  item: "Phân NPK",
                  quantity: 50,
                },
              ]}
              equipment={[
                {
                  item: "Bình tưới",
                  quantity: 1,
                },
              ]}
              pesticides={[
                {
                  item: "Confidor",
                  quantity: 1,
                },
              ]}
              mode="view"
            />
            <GrowthStageCard
              stageName="Giai đoạn sinh trưởng"
              materials={[
                {
                  item: "Phân NPK",
                  quantity: 50,
                },
              ]}
              equipment={[
                {
                  item: "Bình tưới",
                  quantity: 1,
                },
              ]}
              pesticides={[
                {
                  item: "Confidor",
                  quantity: 1,
                },
              ]}
              mode="view"
            />
            <GrowthStageCard
              stageName="Giai đoạn sinh trưởng"
              materials={[
                {
                  item: "Phân NPK",
                  quantity: 50,
                },
              ]}
              equipment={[
                {
                  item: "Bình tưới",
                  quantity: 1,
                },
              ]}
              pesticides={[
                {
                  item: "Confidor",
                  quantity: 1,
                },
              ]}
              mode="view"
            />
            <GrowthStageCard
              stageName="Giai đoạn sinh trưởng"
              materials={[
                {
                  item: "Phân NPK",
                  quantity: 50,
                },
              ]}
              equipment={[
                {
                  item: "Bình tưới",
                  quantity: 1,
                },
              ]}
              pesticides={[
                {
                  item: "Confidor",
                  quantity: 1,
                },
              ]}
              mode="view"
            />
          </SimpleGrid>
        </Stack>
      </Card>
    </Stack>
  );
};

export default ConfirmStep;
