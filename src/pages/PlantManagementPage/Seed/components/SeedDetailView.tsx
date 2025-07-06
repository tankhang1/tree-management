import { Stack, Text, Group, Image, Divider, Badge, Box } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";

const SeedDetailView = ({
  seed,
}: {
  seed: {
    id: string;
    name: string;
    supplier: string;
    origin: string;
    germinationRate: string;
    yield: string;
    note: string;
    imageUrl?: string;
    technicalDocUrl?: string;
    technicalContent?: string;
  };
}) => {
  return (
    <Stack gap="xs">
      <Group gap="md">
        <Box w={220}>
          <Image
            src={seed.imageUrl || ""}
            alt="Ảnh giống"
            radius="md"
            fallbackSrc="https://placehold.co/220x140?text=No+Image"
          />
        </Box>

        <Stack gap="xs" style={{ flex: 1 }}>
          <Group gap="sm">
            <Text c="dimmed" size="sm">
              Mã giống:
            </Text>
            <Badge color="gray" variant="outline">
              {seed.id}
            </Badge>
          </Group>

          <Group gap="sm">
            <Text c="dimmed" size="sm">
              Tên giống:
            </Text>
            <Text fw={500}>{seed.name}</Text>
          </Group>

          <Group gap="sm">
            <Text c="dimmed" size="sm">
              Nhà cung cấp:
            </Text>
            <Text>{seed.supplier || "—"}</Text>
          </Group>

          <Group gap="sm">
            <Text c="dimmed" size="sm">
              Xuất xứ:
            </Text>
            <Text>{seed.origin || "—"}</Text>
          </Group>

          <Group gap="sm">
            <Text c="dimmed" size="sm">
              Tỷ lệ nảy mầm:
            </Text>
            <Text>{seed.germinationRate || "—"}%</Text>
          </Group>

          <Group gap="sm">
            <Text c="dimmed" size="sm">
              Năng suất:
            </Text>
            <Text>{seed.yield || "—"} tấn/ha</Text>
          </Group>
        </Stack>
      </Group>

      <Divider label="Mô tả" labelPosition="left" />
      <Box
        dangerouslySetInnerHTML={{
          __html: seed.note || "<i>Không có mô tả</i>",
        }}
        style={{ fontSize: 14 }}
      />

      <Divider label="Tài liệu kỹ thuật" labelPosition="left" />

      {seed.technicalDocUrl ? (
        <Group gap="sm">
          <IconFileTypePdf size={18} />
          <a
            href={seed.technicalDocUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem tài liệu kỹ thuật
          </a>
        </Group>
      ) : seed.technicalContent ? (
        <Box
          dangerouslySetInnerHTML={{
            __html: seed.technicalContent,
          }}
          style={{ background: "#f8f9fa", padding: 12, borderRadius: 8 }}
        />
      ) : (
        <Text c="dimmed" size="sm">
          Không có tài liệu kỹ thuật
        </Text>
      )}
    </Stack>
  );
};

export default SeedDetailView;
