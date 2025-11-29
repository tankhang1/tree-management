import {
  Badge,
  Card,
  Divider,
  Group,
  Image,
  List,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
  Button,
} from "@mantine/core";
import { useVarietyStore } from "../../../zustand/varietyStore";

const Labeled = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Stack gap={2}>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
    <Text fw={500}>{value || "—"}</Text>
  </Stack>
);

const FieldGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card withBorder radius={4} p="md" shadow="xs">
    <Title order={5} mb="xs">
      {title}
    </Title>
    <Stack gap="sm">{children}</Stack>
  </Card>
);

type Props = {
  viewId: string | null;
  opened: boolean;
  onClose: () => void;
};

const VarietyDetailModal = ({ viewId, opened, onClose }: Props) => {
  const { getVarietyById } = useVarietyStore();

  // Lấy dữ liệu từ store
  const data = viewId ? getVarietyById(viewId) : null;

  if (!data) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      radius={4}
      title={<Title order={4}>Chi tiết giống: {data.id}</Title>}
    >
      <Stack gap="md">
        {/* Header Info */}
        <Card withBorder radius={4} p="md" shadow="xs">
          <Group align="flex-start" gap="lg">
            <Image
              src={data.imgUrl}
              h={140}
              w={180}
              radius={4}
              fit="cover"
              fallbackSrc="https://placehold.co/180x140?text=No+Image"
            />
            <Stack gap={4} style={{ flex: 1 }}>
              <Title order={4}>{data.name}</Title>
              <Group gap="xs" wrap="wrap">
                <Badge variant="dot" color="blue">
                  {data.treeName}
                </Badge>
                {data.isCertified && (
                  <Badge color="green" variant="light">
                    {data.certificationCode || "Certified"}
                  </Badge>
                )}
                {data.hashtags?.map((h) => (
                  <Badge key={h} variant="light">
                    {h}
                  </Badge>
                ))}
              </Group>
              <Text c="dimmed" size="sm" mt="xs">
                {data.description}
              </Text>
            </Stack>
          </Group>
        </Card>

        {/* Details Grid */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <FieldGroup title="Đặc tính">
            <SimpleGrid cols={2}>
              <Labeled label="Nguồn gốc" value={data.origin} />
              <Labeled
                label="Ngày chín"
                value={data.maturityDays ? `${data.maturityDays} ngày` : ""}
              />
              <Labeled
                label="Năng suất"
                value={data.yieldKgPerTree ? `~${data.yieldKgPerTree} kg` : ""}
              />
            </SimpleGrid>
            {data.season && (
              <Group gap="xs" mt="sm">
                <Text size="xs" c="dimmed">
                  Mùa vụ:
                </Text>
                {data.season.map((s) => (
                  <Badge key={s} variant="outline" size="sm">
                    {s}
                  </Badge>
                ))}
              </Group>
            )}
          </FieldGroup>

          <FieldGroup title="Ghi chú canh tác">
            <Text size="sm">{data.notes || "Không có ghi chú đặc biệt."}</Text>
          </FieldGroup>
        </SimpleGrid>

        {/* Document Section */}
        <FieldGroup title="Tài liệu kỹ thuật">
          {data.docType === "file" ? (
            <Text c="blue" td="underline" style={{ cursor: "pointer" }}>
              📄 {data.docContent || "Tài liệu đính kèm.pdf"}
            </Text>
          ) : (
            <TypographyStylesProvider>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.docContent || "<p>Chưa cập nhật</p>",
                }}
              />
            </TypographyStylesProvider>
          )}
        </FieldGroup>

        <Divider />
        <Group justify="flex-end">
          <Button variant="default" radius={4} onClick={onClose}>
            Đóng
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default VarietyDetailModal;
