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
  IconClipboardText,
  IconLayersSubtract,
  IconClockHour4,
} from "@tabler/icons-react";

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
        <Card withBorder h={300}>
          <Stack gap={4}>
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
              <Text fw={500}>Nhóm cây trồng:</Text>
              <Text>{data.treeGroup}</Text>
            </Group>
            <Group>
              <Text fw={500}>Loại cây trồng:</Text>
              <Text>{data.treeCategory}</Text>
            </Group>
            <Group>
              <Text fw={500}>Tên giống cây:</Text>
              <Text>{data.crop}</Text>
            </Group>
            <Group>
              <Text fw={500}>Thời gian chu kỳ:</Text>
              <Text>{data.duration} ngày</Text>
            </Group>
          </Stack>
        </Card>
        <Card withBorder>
          <Group grow align="flex-start">
            <Stack>
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

              <Group align="start">
                <Text fw={500}>Mô tả:</Text>
                <Text size="sm" maw={600}>
                  {data.cropDescription}
                </Text>
              </Group>
            </Stack>
            <Image
              src={data.cropImage}
              flex={1}
              radius="md"
              alt="Ảnh cây trồng"
            />
          </Group>
        </Card>
      </Group>

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

      <Divider
        label="Danh sách chu kỳ và giai đoạn"
        labelPosition="center"
        my="md"
      />

      {data.cycles.map((cycle, cycleIdx) => (
        <Accordion multiple variant="separated" key={cycleIdx}>
          {cycle.stages.map((stage, stageIdx) => (
            <Accordion.Item
              value={`cycle-${cycleIdx}-stage-${stageIdx}`}
              key={stageIdx}
            >
              <Accordion.Control>
                <Group>
                  <IconClockHour4 size={16} />
                  <Text fw={600}>
                    {cycle.name} – {stage.name} ({stage.duration} ngày)
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

                  <Text fw={500}>Trưởng nhóm:</Text>
                  <Text size="sm">👤 {stage.leader}</Text>

                  <Text fw={500}>Nhân sự:</Text>
                  <Group gap={4}>
                    {stage.members.map((member, i) => (
                      <Badge key={i}>{member}</Badge>
                    ))}
                  </Group>

                  <Divider label="Tài sản" labelPosition="left" my="xs" />
                  {stage.resources.map((res, i) => (
                    <Text key={i} size="sm">
                      📌 {res.type}: {res.amount} {res.unit || ""}
                    </Text>
                  ))}

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
      ))}
    </Stack>
  );
};

export default ConfirmStep;
