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
import Table from "../../../../components/Table";

type Variety = {
  id: string;
  name: string;
  treeName: string;
  imgUrl: string;
  origin: string;
  maturityDays: number;
  yieldKgPerTree: number;
  season: string[];
  resistance: string[];
  hashtags: string[];
  description: string;
  notes: string;
  isCertified: boolean;
  certificationCode?: string;
  docHtml?: string;
  batches?: { batch: string; mfg: string; exp: string; qty: number }[];
  related?: string[];
};

const sample: Variety = {
  id: "VAR001",
  name: "Sầu riêng Ri6",
  treeName: "Sầu riêng",
  imgUrl:
    "https://happyagri.com.vn/storage/d1/um/d1um6h2dksblr96z47z69cj2cnbg_sau-rieng-ri6-(2).webp",
  origin: "Đồng Nai",
  maturityDays: 120,
  yieldKgPerTree: 60,
  season: ["Mùa mưa", "Mùa nắng sớm"],
  resistance: ["Xì mủ tốt", "Thán thư trung bình"],
  hashtags: ["Đặc sản", "Năng suất cao", "Thị trường ưa chuộng"],
  description:
    "Giống cơm vàng, hạt lép, vị béo nhẹ. Thích hợp đất bazan, thoát nước tốt.",
  notes:
    "Tỉa cành thông thoáng, phòng nấm khi mưa kéo dài, bón cân đối NPK + vi lượng.",
  isCertified: true,
  certificationCode: "OCOP-2025-DRI6",
  docHtml:
    "<h3>Hướng dẫn kỹ thuật</h3><p>Mật độ 6x6m (≈278 cây/ha). Bón nền hữu cơ 10–15kg/gốc, bổ sung vi lượng theo giai đoạn.</p><ul><li>Giai đoạn kiến thiết: NPK 16-16-8, 0.5–1kg/cây/tháng</li><li>Ra hoa–đậu trái: Tăng K, bổ sung Bo, Ca</li></ul>",
  batches: [
    { batch: "BATCH-0825-001", mfg: "2025-08-01", exp: "2027-08-01", qty: 320 },
    { batch: "BATCH-0725-004", mfg: "2025-07-10", exp: "2027-07-10", qty: 180 },
  ],
  related: ["VAR002–Monthong", "VAR005–Ri10"],
};

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
    <Text>{value}</Text>
  </Stack>
);

const FieldGroup = ({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card withBorder radius={4} p="md" shadow="xs">
    <Group justify="space-between" mb="xs">
      <Title order={5}>{title}</Title>
      {right}
    </Group>
    <Stack gap="sm">{children}</Stack>
  </Card>
);

const VarietyDetailModal = ({
  data = sample,
  opened,
  onClose,
}: {
  data?: Variety;
  opened: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      radius={4}
      title={<Title order={4}>Chi tiết giống</Title>}
    >
      <Stack gap="md">
        <Card withBorder radius={4} p="md" shadow="xs">
          <Group align="flex-start" gap="lg">
            <Image src={data.imgUrl} h={140} w={180} radius={4} fit="cover" />
            <Stack gap={4} style={{ flex: 1 }}>
              <Title order={4}>{data.name}</Title>
              <Group gap="xs" wrap="wrap">
                <Badge variant="dot" color="gray">
                  {data.treeName}
                </Badge>
                {data.isCertified && (
                  <Badge color="green" variant="light">
                    {data.certificationCode}
                  </Badge>
                )}
                {data.hashtags.map((h) => (
                  <Badge key={h} variant="light">
                    {h}
                  </Badge>
                ))}
              </Group>
              <Text c="dimmed" size="sm">
                {data.description}
              </Text>
            </Stack>
          </Group>
        </Card>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <FieldGroup title="Đặc tính">
            <SimpleGrid cols={2}>
              <Labeled label="Mã giống" value={data.id} />
              <Labeled label="Nguồn gốc" value={data.origin} />
              <Labeled
                label="Số ngày chín"
                value={`${data.maturityDays} ngày`}
              />
              <Labeled
                label="Năng suất"
                value={`~${data.yieldKgPerTree} kg/cây`}
              />
            </SimpleGrid>
            <Group gap="xs" wrap="wrap">
              <Badge variant="outline">Mùa vụ: {data.season.join(", ")}</Badge>
              <Badge variant="outline">
                Kháng bệnh: {data.resistance.join(", ")}
              </Badge>
            </Group>
          </FieldGroup>

          <FieldGroup title="Ghi chú canh tác">
            <Text size="sm">{data.notes}</Text>
          </FieldGroup>
        </SimpleGrid>

        <FieldGroup
          title="Tài liệu kỹ thuật"
          right={
            <Text size="xs" c="dimmed">
              HTML
            </Text>
          }
        >
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{
                __html: data.docHtml || "<p>(Chưa có)</p>",
              }}
            />
          </TypographyStylesProvider>
        </FieldGroup>

        <Stack gap="md">
          <FieldGroup title="Lô gần đây">
            {data.batches && data.batches.length > 0 ? (
              <Table
                columns={[
                  {
                    accessorKey: "batch",
                    header: "Lô",
                  },
                  {
                    accessorKey: "mfg",
                    header: "NSX",
                  },
                  {
                    accessorKey: "exp",
                    header: "HSD",
                  },
                  {
                    accessorKey: "qty",
                    header: "SL",
                  },
                ]}
                data={data.batches}
              />
            ) : (
              <Text size="sm" c="dimmed">
                Không có dữ liệu
              </Text>
            )}
          </FieldGroup>

          <FieldGroup title="Giống liên quan">
            {data.related && data.related.length > 0 ? (
              <List spacing={4}>
                {data.related.map((r) => (
                  <List.Item key={r}>
                    <Text>{r}</Text>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Text size="sm" c="dimmed">
                Không có dữ liệu
              </Text>
            )}
          </FieldGroup>
        </Stack>

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
