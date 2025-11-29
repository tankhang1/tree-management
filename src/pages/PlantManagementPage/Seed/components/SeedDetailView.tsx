import {
  Badge,
  Box,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconLeaf,
  IconMapPin,
  IconBuildingStore,
  IconFileTypePdf,
  IconChartBar,
  IconPercentage,
} from "@tabler/icons-react";
import type { Seed } from "../../../zustand/seedStore";

const SeedDetailView = ({ seed }: { seed: Seed }) => {
  return (
    <Stack gap="md">
      {/* --- PHẦN 1: HÌNH ẢNH VÀ THÔNG TIN CƠ BẢN --- */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <Image
            src={seed.imgUrl || ""}
            alt={seed.name}
            radius="md"
            h={200}
            fit="contain"
            bg="gray.1"
            fallbackSrc="https://placehold.co/220x200?text=No+Image"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 7 }}>
          <Stack gap="xs">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {seed.id}
                </Text>
                <Text size="xl" fw={700} lh={1.2}>
                  {seed.name}
                </Text>
              </div>
              <Badge
                size="lg"
                color={seed.germinationRate >= 85 ? "green" : "yellow"}
              >
                Nảy mầm {seed.germinationRate}%
              </Badge>
            </Group>

            <Divider my="xs" variant="dashed" />

            <Stack gap={6}>
              <InfoRow
                icon={IconBuildingStore}
                label="Nhà cung cấp"
                value={seed.supplier}
              />
              <InfoRow icon={IconMapPin} label="Xuất xứ" value={seed.origin} />
              <InfoRow
                icon={IconChartBar}
                label="Năng suất"
                value={seed.yield || "—"}
              />
              <InfoRow
                icon={IconPercentage}
                label="Độ đồng đều"
                value={seed.uniformity ? `${seed.uniformity}%` : "—"}
              />
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* --- PHẦN 2: MÔ TẢ --- */}
      <Paper withBorder p="md" radius="md" bg="gray.0">
        <Group mb="xs" gap="xs">
          <ThemeIcon color="blue" variant="light" size="sm">
            <IconLeaf size={14} />
          </ThemeIcon>
          <Text fw={600} size="sm">
            Mô tả đặc tính
          </Text>
        </Group>
        <Box
          className="sun-editor-editable" // Class này giúp giữ style của SunEditor
          dangerouslySetInnerHTML={{
            __html: seed.note || "<i style='color: gray'>Chưa có mô tả</i>",
          }}
          style={{ fontSize: 14, lineHeight: 1.6 }}
        />
      </Paper>

      {/* --- PHẦN 3: TÀI LIỆU KỸ THUẬT --- */}
      <div>
        <Divider
          label="Tài liệu kỹ thuật canh tác"
          labelPosition="left"
          mb="sm"
        />

        {seed.docType === "file" && seed.technicalDoc ? (
          <Paper withBorder p="sm" radius="md">
            <Group>
              <ThemeIcon color="red" size="lg" variant="light">
                <IconFileTypePdf size={24} />
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {seed.technicalDoc}
                </Text>
                <Text size="xs" c="dimmed">
                  Định dạng PDF
                </Text>
              </div>
              <a
                href="#" // Ở môi trường thật, đây sẽ là URL tải file
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Đang tải file: ${seed.technicalDoc}`);
                }}
                style={{
                  textDecoration: "none",
                  color: "var(--mantine-color-blue-6)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Tải xuống
              </a>
            </Group>
          </Paper>
        ) : seed.docType === "editor" && seed.technicalContent ? (
          <Box
            p="md"
            style={{ border: "1px solid #dee2e6", borderRadius: 8 }}
            dangerouslySetInnerHTML={{ __html: seed.technicalContent }}
          />
        ) : (
          <Text c="dimmed" size="sm" fs="italic">
            Chưa cập nhật tài liệu kỹ thuật.
          </Text>
        )}
      </div>
    </Stack>
  );
};

// Component con để hiển thị dòng thông tin cho gọn code
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <Group gap="xs" wrap="nowrap">
    <ThemeIcon variant="transparent" c="dimmed" size="xs">
      <Icon size={16} />
    </ThemeIcon>
    <Text size="sm" c="dimmed" style={{ minWidth: 100 }}>
      {label}:
    </Text>
    <Text size="sm" fw={500} style={{ flex: 1 }}>
      {value}
    </Text>
  </Group>
);

export default SeedDetailView;
