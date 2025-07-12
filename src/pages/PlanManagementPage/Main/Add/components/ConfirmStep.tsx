import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  Badge,
  Image,
  Accordion,
} from "@mantine/core";
import {
  IconMapPin,
  IconClockHour4,
  IconClipboardText,
  IconLayersSubtract,
} from "@tabler/icons-react";

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

      <Card withBorder>
        <Stack gap={4}>
          <Group>
            <Text fw={500}>Mùa vụ:</Text>
            <Text>{data.season}</Text>
          </Group>
          <Group>
            <Text fw={500}>Nhóm cây trồng:</Text>
            <Text>{data.treeGroup}</Text>
          </Group>
          <Group>
            <Text fw={500}>Danh mục cây trồng:</Text>
            <Text>{data.treeCategory}</Text>
          </Group>
          <Group>
            <Text fw={500}>Cây trồng:</Text>
            <Text>{data.crop}</Text>
          </Group>
          <Group>
            <Text fw={500}>Thời gian chu kỳ:</Text>
            <Text>{data.duration} ngày</Text>
          </Group>
        </Stack>
      </Card>

      <Divider label="Thông tin cây trồng" labelPosition="center" my="md" />
      <Card withBorder>
        <Stack gap={4}>
          <Group>
            <Text fw={500}>Mã cây:</Text>
            <Text>{data.cropCode}</Text>
          </Group>
          <Group>
            <Text fw={500}>Giống cây:</Text>
            <Text>{data.cropVariety}</Text>
          </Group>
          <Group>
            <Text fw={500}>Hạt giống:</Text>
            <Text>{data.cropSeed}</Text>
          </Group>
          <Group>
            <Text fw={500}>Đơn vị thu hoạch:</Text>
            <Text>{data.harvestUnit}</Text>
          </Group>
          <Stack align="start">
            <Text fw={500}>Ảnh minh họa:</Text>
            <Image
              src={data.cropImage}
              w={200}
              h={200}
              radius="md"
              alt="Ảnh cây trồng"
            />
          </Stack>
          <Group align="start">
            <Text fw={500}>Mô tả:</Text>
            <Text size="sm" maw={600}>
              {data.cropDescription}
            </Text>
          </Group>
        </Stack>
      </Card>

      <Divider label="Vị trí canh tác" labelPosition="center" my="md" />
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

      <Divider label="Danh sách giai đoạn" labelPosition="center" my="md" />

      <Accordion multiple variant="separated">
        {data.stages.map((stage, idx) => (
          <Accordion.Item value={`stage-${idx}`} key={idx}>
            <Accordion.Control>
              <Group>
                <IconClockHour4 size={16} />
                <Text fw={600}>
                  {stage.name} ({stage.duration} ngày)
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Text fw={500}>Tài liệu kỹ thuật:</Text>
                {stage.documentType === "file" ? (
                  <Text size="sm">📎 {stage.document}</Text>
                ) : (
                  <Text size="sm">📝 {stage.document}</Text>
                )}

                {stage.materials.length > 0 && (
                  <>
                    <Text fw={500}>Vật tư:</Text>
                    <Stack gap={4}>
                      {stage.materials.map((m, i) => (
                        <Badge key={i}>{m}</Badge>
                      ))}
                    </Stack>
                  </>
                )}

                {stage.equipment.length > 0 && (
                  <>
                    <Text fw={500}>Thiết bị:</Text>
                    <Stack gap={4}>
                      {stage.equipment.map((e, i) => (
                        <Badge key={i}>{e}</Badge>
                      ))}
                    </Stack>
                  </>
                )}

                {stage.pesticides.length > 0 && (
                  <>
                    <Text fw={500}>Thuốc BVTV:</Text>
                    <Stack gap={4}>
                      {stage.pesticides.map((p, i) => (
                        <Badge key={i}>{p}</Badge>
                      ))}
                    </Stack>
                  </>
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Stack>
  );
};

export default ConfirmStep;
