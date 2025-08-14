import {
  Anchor,
  Badge,
  Card,
  Divider,
  Group,
  List,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconLeaf } from "@tabler/icons-react";

export type TreeDetail = {
  id: string;
  name: string;
  type: string;
  note: string;
  seedCode: string;
  seedName: string;
  supplier: string;
  origin: string;
  germinationRate: string; // %
  yield: string; // kg/cây hoặc tương đương
  seedNote: string;
  seedDoc: string | null; // URL hoặc null
  harvestMethod: string;
  growthCycle: string; // mô tả, ví dụ: "Trung bình 3 năm"
  growthStages: string[];
  growthTime: string; // ngày
  growthNote: string;
};

export function TreeDetailModal({
  opened,
  onClose,
  data,
}: {
  opened: boolean;
  onClose: () => void;
  data: TreeDetail;
}) {
  if (!data) return null;
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap={8}>
          <ThemeIcon variant="light">
            <IconLeaf size={16} />
          </ThemeIcon>
          <Text fw={700}>Chi tiết cây trồng</Text>
        </Group>
      }
      radius={4}
      size={800}
    >
      <ScrollArea.Autosize mah={520} type="auto" offsetScrollbars>
        <Stack gap="md">
          {/* Header */}
          <Card withBorder radius={4} p="md">
            <Group justify="space-between" align="start">
              <Stack gap={2}>
                <Text size="lg" fw={700}>
                  {data.name}
                </Text>
                <Text size="sm" c="gray.6">
                  Mã: {data.id}
                </Text>
              </Stack>
              <Badge variant="light">{data.type}</Badge>
            </Group>
            {data.note && (
              <Text size="sm" mt={8}>
                {data.note}
              </Text>
            )}
          </Card>

          {/* Seed & origin */}
          <Card withBorder radius={4} p="md">
            <Text fw={600} mb={6}>
              Giống & Nguồn gốc
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={8}>
              <Text size="sm">
                <b>Mã giống:</b> {data.seedCode}
              </Text>
              <Text size="sm">
                <b>Tên giống:</b> {data.seedName}
              </Text>
              <Text size="sm">
                <b>Nhà cung cấp:</b> {data.supplier}
              </Text>
              <Text size="sm">
                <b>Xuất xứ:</b> {data.origin}
              </Text>
              <Text size="sm">
                <b>Tỷ lệ nảy mầm:</b> {data.germinationRate}%
              </Text>
              <Text size="sm">
                <b>Năng suất ước tính:</b> {data.yield} kg/cây
              </Text>
            </SimpleGrid>
            {data.seedNote && (
              <Text size="sm" mt={8}>
                {data.seedNote}
              </Text>
            )}
            {data.seedDoc && (
              <Anchor href={data.seedDoc} target="_blank" size="sm" mt={6}>
                Tài liệu giống
              </Anchor>
            )}
          </Card>

          {/* Growth & harvest */}
          <Card withBorder radius={4} p="md">
            <Text fw={600} mb={6}>
              Sinh trưởng & Thu hoạch
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={8}>
              <Text size="sm">
                <b>Chu kỳ sinh trưởng:</b> {data.growthCycle}
              </Text>
              <Text size="sm">
                <b>Thời gian (ước tính):</b> {data.growthTime} ngày
              </Text>
              <Text size="sm">
                <b>Phương pháp thu hoạch:</b> {data.harvestMethod}
              </Text>
            </SimpleGrid>
            <Divider my="sm" />
            <Text size="sm" fw={600} mb={6}>
              Các giai đoạn
            </Text>
            <List spacing={6} size="sm" withPadding>
              {data.growthStages.map((s, idx) => (
                <List.Item
                  key={idx}
                  icon={
                    <ThemeIcon variant="light" size={18} radius={6}>
                      <IconLeaf size={12} />
                    </ThemeIcon>
                  }
                >
                  {s}
                </List.Item>
              ))}
            </List>
            {data.growthNote && (
              <Text size="sm" mt={8}>
                {data.growthNote}
              </Text>
            )}
          </Card>
        </Stack>
      </ScrollArea.Autosize>
    </Modal>
  );
}
