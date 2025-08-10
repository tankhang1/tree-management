import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Text,
  Title,
  Tooltip,
  rem,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";

/* ---- Card item (máy/vật tư/thuốc) - đẹp hơn, gọn hơn ---- */
function ItemCard({
  item,
  onDelete,
}: {
  item: {
    id: string;
    name: string;
    img?: string;
    code?: string;
    unit?: string;
  };
  onDelete?: (id: string) => void;
}) {
  const [qty, setQty] = useState<number | "">("");

  return (
    <Card
      withBorder
      radius={4}
      shadow="sm"
      p="md"
      miw={520}
      h={160}
      style={{
        cursor: "pointer",
        transition:
          "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <Group align="flex-start" gap="md" wrap="nowrap">
        <Image
          src={item?.img || "https://via.placeholder.com/180x120?text=No+Image"}
          alt={item.name}
          w={180}
          h={120}
          radius={4}
          fit="cover"
          style={{ flexShrink: 0 }}
        />

        <Stack gap={8} flex={1}>
          <Group justify="space-between" align="start">
            <Stack gap={2}>
              <Text fw={600} size="lg" lineClamp={1}>
                {item.name}
              </Text>
              <Group gap="xs">
                <Badge variant="light" color="gray">
                  Mã: {item.code ?? item.id}
                </Badge>
              </Group>
            </Stack>

            <Tooltip label="Xoá">
              <ActionIcon
                color="red"
                variant="light"
                radius={4}
                onClick={() => onDelete?.(item.id)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group grow align="center" gap="sm">
            <NumberInput
              flex={1}
              radius={4}
              placeholder={`Số lượng${item.unit ? ` (${item.unit})` : ""}`}
              value={qty}
              onChange={(v) => setQty(typeof v === "number" ? v : "")}
              min={0}
              styles={{ input: { height: rem(36) } }}
            />
            <Select
              placeholder="Quy cách"
              radius={4}
              data={[
                { value: "QC1", label: "Cái" },
                { value: "QC2", label: "Bộ" },
                { value: "QC3", label: "Hộp" },
              ]}
            />
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}

/* ---- Section tái sử dụng - header đẹp + badge đếm + empty state ---- */
function Section({
  title,
  data,
  onAdd,
  onDelete,
  height = 240,
}: {
  title: string;
  data: Array<{
    id: string;
    name: string;
    img?: string;
    code?: string;
    unit?: string;
  }>;
  onAdd?: () => void;
  onDelete?: (id: string) => void;
  height?: number;
}) {
  const count = useMemo(() => data.length, [data]);

  return (
    <Card withBorder radius={4} shadow="sm" p="lg">
      {/* Header */}
      <Group justify="space-between" mb="md" align="center">
        <Group gap="sm">
          <Title order={5}>{title}</Title>
          <Badge variant="light" color="blue">
            {count} mục
          </Badge>
        </Group>

        <Button variant="filled" radius={4} onClick={onAdd}>
          Thêm mới
        </Button>
      </Group>

      <Divider mb="md" />

      {/* List */}
      {count === 0 ? (
        <Card withBorder radius={4} p="xl" bg="gray.0">
          <Stack align="center" gap="xs">
            <Text c="dimmed">Chưa có mục nào. Hãy thêm mục đầu tiên.</Text>
            <Button variant="subtle" onClick={onAdd}>
              Thêm mới
            </Button>
          </Stack>
        </Card>
      ) : (
        <ScrollArea
          h={height}
          type="auto"
          offsetScrollbars
          scrollHideDelay={1200}
        >
          <Group gap="md" wrap="nowrap" p="xs">
            {data.map((item) => (
              <ItemCard key={item.id} item={item} onDelete={onDelete} />
            ))}
          </Group>
        </ScrollArea>
      )}
    </Card>
  );
}

export default Section;
