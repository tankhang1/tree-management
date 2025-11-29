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
  ThemeIcon,
  Paper,
  Box,
} from "@mantine/core";
import {
  IconLeaf,
  IconClock,
  IconFileText,
  IconTool,
  IconSeeding,
  IconInfoCircle,
} from "@tabler/icons-react";

// Định nghĩa kiểu dữ liệu props nhận vào
interface ConfirmStepProps {
  data: any; // Dữ liệu từ form.values
  imagePreview: string | null; // Ảnh preview (Base64)
  seedName: string; // Tên hạt giống đã chọn
}

const ConfirmStep = ({ data, imagePreview, seedName }: ConfirmStepProps) => {
  // Helper để hiển thị nội dung tài liệu
  const renderDocInfo = (label: string, type: string, content: string) => (
    <Paper withBorder p="sm" radius="md">
      <Group>
        <ThemeIcon color={content ? "blue" : "gray"} variant="light">
          <IconFileText size={18} />
        </ThemeIcon>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {label}
          </Text>
          {content ? (
            <Text size="xs" c="dimmed">
              {type === "file"
                ? `File đính kèm: ${content}`
                : "Nội dung đã soạn thảo"}
            </Text>
          ) : (
            <Text size="xs" c="dimmed" fs="italic">
              Chưa cập nhật
            </Text>
          )}
        </div>
      </Group>
    </Paper>
  );

  return (
    <Stack gap="lg" mt="md">
      {/* 1. THÔNG TIN CHUNG */}
      <Card withBorder radius="md" shadow="sm" p="lg">
        <Group justify="space-between" mb="md">
          <Title order={4} c="green.8">
            <Group gap="xs">
              <IconInfoCircle /> Thông tin chung
            </Group>
          </Title>
          <Badge size="lg" color="green">
            {data.group || "Chưa chọn nhóm"}
          </Badge>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Image
              src={imagePreview}
              h={200}
              w="100%"
              radius="md"
              alt="Ảnh cây trồng"
              fit="cover"
              fallbackSrc="https://placehold.co/400x300?text=No+Image"
              style={{ border: "1px solid #eee" }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="sm">
              <Group>
                <Text fw={600} w={120}>
                  Mã cây:
                </Text>
                <Text>{data.id}</Text>
              </Group>
              <Divider variant="dashed" />

              <Group>
                <Text fw={600} w={120}>
                  Tên cây:
                </Text>
                <Text size="lg" fw={700} c="blue">
                  {data.name}
                </Text>
              </Group>
              <Divider variant="dashed" />

              <Group>
                <Text fw={600} w={120}>
                  Loại cây:
                </Text>
                <Text>{data.type}</Text>
              </Group>
              <Divider variant="dashed" />

              <Group>
                <Text fw={600} w={120}>
                  Giống (Variety):
                </Text>
                <Text>{data.variety || "—"}</Text>
              </Group>
              <Divider variant="dashed" />

              <Group align="flex-start">
                <Text fw={600} w={120}>
                  Mô tả:
                </Text>
                <Text size="sm" c="dimmed" style={{ flex: 1 }}>
                  {data.note || "Không có mô tả"}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* 2. HẠT GIỐNG & THU HOẠCH */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" h="100%">
            <Title order={5} mb="sm" c="orange.8">
              <Group gap="xs">
                <IconSeeding size={20} /> Hạt giống nguồn
              </Group>
            </Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Mã hạt giống:
                </Text>
                <Badge variant="outline" color="orange">
                  {data.seedCode || "Chưa chọn"}
                </Badge>
              </Group>
              <Text size="sm" fw={500}>
                {seedName || "—"}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" h="100%">
            <Title order={5} mb="sm" c="blue.8">
              <Group gap="xs">
                <IconTool size={20} /> Thu hoạch
              </Group>
            </Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Phương pháp:
                </Text>
                <Text fw={500}>{data.harvestMethod || "Chưa chọn"}</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* 3. CHU KỲ SINH TRƯỞNG */}
      <Card withBorder radius="md">
        <Title order={4} mb="md" c="teal.8">
          <Group gap="xs">
            <IconClock /> Chu kỳ sinh trưởng ({data.growthCycles.length})
          </Group>
        </Title>

        {data.growthCycles.length > 0 ? (
          <Stack gap="md">
            {data.growthCycles.map((cycle: any, index: number) => (
              <Card key={index} bg="gray.0" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={600} size="sm">
                    #{index + 1}. {cycle.name}
                  </Text>
                  <Badge color="teal" variant="light">
                    {cycle.estimatedTime} ngày
                  </Badge>
                </Group>

                <Group gap="xs">
                  {cycle.stages && cycle.stages.length > 0 ? (
                    cycle.stages.map((stage: string, idx: number) => (
                      <Badge key={idx} variant="white" color="gray" size="sm">
                        {stage}
                      </Badge>
                    ))
                  ) : (
                    <Text size="xs" c="dimmed">
                      Chưa có giai đoạn
                    </Text>
                  )}
                </Group>
              </Card>
            ))}
          </Stack>
        ) : (
          <Text c="dimmed" fs="italic" ta="center" py="md">
            Chưa thiết lập chu kỳ sinh trưởng
          </Text>
        )}
      </Card>

      {/* 4. TÀI LIỆU KỸ THUẬT */}
      <Card withBorder radius="md">
        <Title order={4} mb="md" c="indigo.8">
          <Group gap="xs">
            <IconLeaf /> Tài liệu kèm theo
          </Group>
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {renderDocInfo(
              "Kỹ thuật canh tác",
              data.techDocType,
              data.techDocContent
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {renderDocInfo(
              "Tiêu chuẩn chất lượng",
              data.standardDocType,
              data.standardDocContent
            )}
          </Grid.Col>
        </Grid>
      </Card>
    </Stack>
  );
};

export default ConfirmStep;
