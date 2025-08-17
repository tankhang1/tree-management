import React, { useMemo, useState } from "react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  List,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import {
  IconAffiliate,
  IconBuilding,
  IconBuildingBank,
  IconCalendar,
  IconCopy,
  IconEdit,
  IconHome,
  IconId,
  IconMail,
  IconMapPin,
  IconNote,
  IconPhone,
  IconSitemap,
  IconTypography,
  IconUser,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

// -----------------------------------------------------------------------------
// Helpers & small components
// -----------------------------------------------------------------------------

const Copyable = ({ text }: { text: string }) => (
  <Button
    variant="subtle"
    size="xs"
    px={6}
    radius={4}
    onClick={() => navigator.clipboard.writeText(text)}
    leftSection={<IconCopy size={14} />}
  >
    Copy
  </Button>
);

function SectionWrapper({
  title,
  icon,
  editing,
  onEdit,
  onCancel,
  onSave,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  editing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card withBorder radius={4} p="lg" shadow="sm">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <ThemeIcon variant="light" size={30} radius={4}>
            {icon}
          </ThemeIcon>
          <Title order={5}>{title}</Title>
        </Group>
        <Group gap={8} wrap="nowrap">
          {!editing && (
            <Button
              size="xs"
              radius={4}
              variant="light"
              onClick={onEdit}
              leftSection={<IconEdit size={14} />}
            >
              Chỉnh sửa
            </Button>
          )}
          {editing && (
            <>
              <Button radius={4} size="xs" variant="default" onClick={onCancel}>
                Huỷ
              </Button>
              <Button radius={4} size="xs" onClick={onSave}>
                Lưu
              </Button>
            </>
          )}
        </Group>
      </Group>
      {children}
    </Card>
  );
}

function ReadField({ label, value }: { label: string; value?: string }) {
  return (
    <Stack gap={2}>
      <Text c="dimmed" size="xs">
        {label}
      </Text>
      <Text>{value || "—"}</Text>
    </Stack>
  );
}

function EditField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <Stack gap={4}>
      <Text c="dimmed" size="xs">
        {label}
      </Text>
      {multiline ? (
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.currentTarget.value)}
          autosize
          radius={4}
          minRows={2}
        />
      ) : (
        <TextInput
          radius={4}
          value={value || ""}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      )}
    </Stack>
  );
}

// Reusable modal form for array items ------------------------------------------------
function useItemModal<T>(initial: T) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<T>(initial);
  const openFor = (i: number, data: T) => {
    setIndex(i);
    setDraft(data);
    setOpen(true);
  };
  const openNew = (data: T) => {
    setIndex(null);
    setDraft(data);
    setOpen(true);
  };
  const close = () => setOpen(false);
  return { open, index, draft, setDraft, openFor, openNew, close };
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------
export default function SimpleInfoEditable() {
  // Sample data (could come from props/API)
  const initial = {
    // --- Hồ sơ chung ---
    type: "Doanh nghiệp" as const,
    status: "Đang hoạt động",
    priority: "Cao",
    code: "DN-ABC-2025-001",
    name: "Công ty TNHH ABC",
    shortName: "ABC Co.",
    brand: "ABC Mart",
    logoUrl: "https://dummyimage.com/96x96/1971c2/ffffff&text=ABC",
    website: "https://abcmart.vn",
    industry: "Bán lẻ nông nghiệp",
    subIndustry: "Vật tư nông nghiệp",
    businessScope:
      "Phân phối vật tư nông nghiệp: phân bón, thuốc BVTV, vật tư bao bì và dụng cụ.",
    foundedAt: "2018-06-15",
    employees: 120,
    representative: "Nguyễn Văn A",
    phone: "+84 912 345 678",
    email: "contact@abcmart.vn",
    address: "Số 10, Đường Hoa Sữa, P.7, Q.Phú Nhuận, TP.HCM",
    category: "Khách hàng",
    relations: ["Khách hàng", "Đối tác", "Nhà cung cấp"],
    tags: ["B2B", "Miền Nam", "Chuỗi bán lẻ"],
    note: "Khách hàng chiến lược khu vực miền Nam.",
    createdAt: "2025-08-10",
    updatedAt: "2025-08-15",
    createdBy: { id: "u001", name: "Admin" },
    updatedBy: { id: "u007", name: "Ngô Minh" },

    // --- Thuế & hoá đơn ---
    taxCode: "0312345678",
    taxAddress: "Tầng 5, 25B Nguyễn Thị Minh Khai, Q.1, TP.HCM",
    vatRate: 8, // %
    vatMethod: "Khấu trừ",
    eInvoice: {
      enabled: true,
      provider: "MISA meInvoice",
      email: "einvoice@abcmart.vn",
    },

    // --- Tài chính ---
    currency: "VND",
    paymentTermDays: 30, // Net 30
    creditLimitVND: 500_000_000, // 500 triệu
    creditUsedVND: 120_000_000,
    priceTier: "Tier-2",

    // --- Logistics mặc định ---
    defaultWarehouse: {
      name: "Kho TP.HCM",
      contact: "+84 988 222 333",
      address: "12/5 Quốc lộ 1A, Quận 12, TP.HCM",
      gps: "10.865834,106.641213",
    },
    deliveryWindows: ["T2–T6: 08:00–17:00", "Thứ 7: 08:00–12:00"],
    shippingMethods: ["Tự vận chuyển", "Nhà xe", "Chành xe"],

    // --- Chứng từ & tuân thủ ---
    certificates: [
      {
        type: "ĐKKD",
        number: "0312345678",
        issuer: "Sở KH&ĐT TP.HCM",
        issueDate: "2018-06-10",
        expiryDate: null,
      },
      {
        type: "Giấy ĐĐK kinh doanh thuốc BVTV",
        number: "BVTV-2023-015",
        issuer: "Cục BVTV",
        issueDate: "2023-03-20",
        expiryDate: "2026-03-20",
      },
    ],
    attachments: [
      {
        name: "Hợp đồng nguyên tắc 2025",
        type: "pdf",
        url: "https://example.com/hd-nguyentac-2025.pdf",
        note: "Hiệu lực 01/01–31/12/2025",
      },
      {
        name: "Bảng giá Tier-2 (07/2025)",
        type: "xlsx",
        url: "https://example.com/banggia-07-2025.xlsx",
      },
    ],
    risk: {
      score: 12,
      level: "Thấp",
      note: "Thanh toán đúng hạn 12 tháng gần nhất",
    },

    // --- SLA/CS ---
    sla: {
      supportHours: "08:00–17:00 T2–T6",
      responseTimeHours: 24,
      accountManager: {
        name: "Phạm Thu Hằng",
        phone: "+84 936 000 111",
        email: "hang.pham@yourcompany.vn",
      },
    },

    // --- Địa chỉ giao nhận (nhiều hơn) ---
    addresses: [
      {
        id: "addr-1",
        recipientName: "Nguyễn Văn A",
        phoneNumber: "+84 912 345 678",
        address: "Số 10, Đường Hoa Sữa, P.7, Q.Phú Nhuận, TP.HCM",
      },
      {
        id: "addr-2",
        recipientName: "Kho ABC - CN Bình Dương",
        phoneNumber: "+84 988 222 333",
        address: "Khu CN VSIP 2, Bến Cát, Bình Dương",
      },
    ],
    defaultAddressId: "addr-2",

    // --- Chi nhánh (nhiều hơn) ---
    branches: [
      {
        name: "Chi nhánh Hà Nội",
        phone: "+84 24 3888 8888",
        email: "hanoi@abcmart.vn",
        address: "Tầng 8, 12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
        taxCode: "0109988776",
        taxAddress: "12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
        note: "Phụ trách miền Bắc",
      },
      {
        name: "Chi nhánh Đà Nẵng",
        phone: "+84 236 373737",
        email: "danang@abcmart.vn",
        address: "25 Trần Phú, Hải Châu, Đà Nẵng",
        taxCode: "0405566778",
        taxAddress: "25 Trần Phú, Hải Châu, Đà Nẵng",
        note: "Logistics miền Trung",
      },
    ],

    // --- Ngân hàng (nhiều hơn) ---
    banks: [
      {
        bank: "Vietcombank",
        accountHolder: "CONG TY TNHH ABC",
        accountNumber: "0011 2345 6789",
        branch: "Chi nhánh Sài Gòn",
        note: "Tài khoản thanh toán chính",
      },
      {
        bank: "Techcombank",
        accountHolder: "CONG TY TNHH ABC",
        accountNumber: "1913 4567 8901",
        branch: "Chi nhánh Hà Nội",
        note: "Thu hộ miền Bắc",
      },
    ],

    // --- Liên hệ (nhiều hơn) ---
    contacts: [
      {
        name: "Trần Thị B",
        phone: "+84 936 111 222",
        email: "b.tran@abcmart.vn",
        role: "Giám đốc mua hàng",
        organization: "Phòng Mua hàng",
        address: "Q.7, TP.HCM",
        note: "Liên hệ chính cho hợp đồng 2025",
      },
      {
        name: "Lê Văn C",
        phone: "+84 937 444 555",
        email: "c.le@abcmart.vn",
        role: "Kế toán trưởng",
        organization: "Phòng Kế toán",
        address: "TP. Thủ Đức, TP.HCM",
        note: "Phụ trách hoá đơn & công nợ",
      },
    ],

    // --- Hợp đồng & giao dịch ---
    contracts: [
      {
        code: "HD-2025-01",
        title: "Hợp đồng mua hàng 2025",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        valueVND: 1_200_000_000,
        status: "Hiệu lực",
      },
      {
        code: "PL-2025-01",
        title: "Phụ lục mức chiết khấu 2025",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        discountTier: [
          { from: 0, to: 300_000_000, percent: 2 },
          { from: 300_000_000, to: 700_000_000, percent: 3.5 },
          { from: 700_000_000, to: null, percent: 5 },
        ],
        status: "Hiệu lực",
      },
    ],
  };

  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState({ base: false, tax: false });

  // Modals for array items
  const addrModal = useItemModal({
    id: "",
    recipientName: "",
    phoneNumber: "",
    address: "",
  });
  const branchModal = useItemModal({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    taxAddress: "",
    note: "",
  });
  const bankModal = useItemModal({
    bank: "",
    accountHolder: "",
    accountNumber: "",
    branch: "",
    note: "",
  });
  const contactModal = useItemModal({
    name: "",
    phone: "",
    email: "",
    role: "",
    organization: "",
    address: "",
    note: "",
  });

  // Header badges
  const typeBadge = useMemo(() => {
    switch (form.type) {
      case "Doanh nghiệp":
        return { color: "blue", icon: <IconBuilding size={14} /> };
      case "Nông hộ":
        return { color: "teal", icon: <IconHome size={14} /> };
      default:
        return { color: "violet", icon: <IconAffiliate size={14} /> };
    }
  }, [form.type]);

  const categoryBadge = useMemo(() => {
    switch (form.category) {
      case "Khách hàng":
        return { color: "green", icon: <IconUser size={14} /> };
      case "Đối tác":
        return { color: "indigo", icon: <IconAffiliate size={14} /> };
      case "Nhà cung cấp":
        return { color: "orange", icon: <IconSitemap size={14} /> };
      case "Ngân hàng":
        return { color: "cyan", icon: <IconBuildingBank size={14} /> };
      default:
        return { color: "gray", icon: <IconSitemap size={14} /> };
    }
  }, [form.category]);

  // Save handlers for section-level editing
  const saveBase = () => setEditing((s) => ({ ...s, base: false }));
  const cancelBase = () => {
    setForm((_) => ({ ...initial }));
    setEditing((s) => ({ ...s, base: false }));
  };
  const saveTax = () => setEditing((s) => ({ ...s, tax: false }));
  const cancelTax = () => {
    setForm((_) => ({ ...initial }));
    setEditing((s) => ({ ...s, tax: false }));
  };

  // Utility to update array items
  function upsertAt<T>(arr: T[], i: number | null, val: T) {
    const next = [...arr];
    if (i === null) next.push(val);
    else next[i] = val;
    return next;
  }

  return (
    <Stack gap="xs" mt="md">
      {/* Header */}
      <Group align="flex-start" justify="space-between" mb="md" wrap="nowrap">
        <Group>
          <Avatar radius={4} size={48} color="blue">
            {form.name?.slice(0, 2).toUpperCase()}
          </Avatar>
          <Stack gap={2}>
            <Group gap={8} wrap="wrap">
              <Title order={3}>{form.name}</Title>
              <Badge color={typeBadge.color} leftSection={typeBadge.icon}>
                {form.type}
              </Badge>
              <Badge
                color={categoryBadge.color}
                leftSection={categoryBadge.icon}
              >
                {form.category}
              </Badge>
            </Group>
            <Group gap={10} c="dimmed">
              <Group gap={6}>
                <IconId size={14} />
                <Text size="sm">{form.code}</Text>
                <Copyable text={form.code} />
              </Group>
              <Divider orientation="vertical" />
              <Group gap={6}>
                <IconCalendar size={14} />
                <Text size="sm">Tạo: {form.createdAt}</Text>
              </Group>
              <Group gap={6}>
                <IconCalendar size={14} />
                <Text size="sm">Cập nhật: {form.updatedAt}</Text>
              </Group>
            </Group>
          </Stack>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* Left column */}
        <Stack gap="md">
          <SectionWrapper
            title="Thông tin cơ bản"
            icon={<IconBuilding size={18} />}
            editing={editing.base}
            onEdit={() => setEditing((s) => ({ ...s, base: true }))}
            onCancel={cancelBase}
            onSave={saveBase}
          >
            {editing.base ? (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <EditField
                  label="Thương hiệu"
                  value={form.brand}
                  onChange={(v) => setForm({ ...form, brand: v })}
                />
                <EditField
                  label="Người đại diện"
                  value={form.representative}
                  onChange={(v) => setForm({ ...form, representative: v })}
                />
                <EditField
                  label="Số điện thoại"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
                <EditField
                  label="Email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
                <EditField
                  label="Địa chỉ"
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                  multiline
                />
              </SimpleGrid>
            ) : (
              <>
                <Group mb="md">
                  {form.relations.map((r) => (
                    <Badge key={r} variant="light">
                      {r}
                    </Badge>
                  ))}
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <ReadField label="Thương hiệu" value={form.brand} />
                  <ReadField
                    label="Người đại diện"
                    value={form.representative}
                  />
                  <Group align="flex-end" gap={12}>
                    <ReadField label="Số điện thoại" value={form.phone} />
                    <Copyable text={form.phone} />
                  </Group>
                  <Group align="flex-end" gap={12}>
                    <ReadField label="Email" value={form.email} />
                    <Copyable text={form.email} />
                  </Group>
                  <Group gap={8}>
                    <ThemeIcon variant="light" radius={4}>
                      <IconMapPin size={16} />
                    </ThemeIcon>
                    <ReadField label="Địa chỉ" value={form.address} />
                  </Group>
                </SimpleGrid>
              </>
            )}
          </SectionWrapper>

          <SectionWrapper
            title="Thông tin thuế"
            icon={<IconId size={18} />}
            editing={editing.tax}
            onEdit={() => setEditing((s) => ({ ...s, tax: true }))}
            onCancel={cancelTax}
            onSave={saveTax}
          >
            {editing.tax ? (
              <>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <EditField
                    label="Mã số thuế"
                    value={form.taxCode}
                    onChange={(v) => setForm({ ...form, taxCode: v })}
                  />
                  <EditField
                    label="Địa chỉ thuế"
                    value={form.taxAddress}
                    onChange={(v) => setForm({ ...form, taxAddress: v })}
                  />
                </SimpleGrid>
                <Divider my="sm" />
                <EditField
                  label="Ghi chú"
                  value={form.note}
                  onChange={(v) => setForm({ ...form, note: v })}
                  multiline
                />
              </>
            ) : (
              <>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Group align="flex-end" gap={12}>
                    <ReadField label="Mã số thuế" value={form.taxCode} />
                    <Copyable text={form.taxCode} />
                  </Group>
                  <ReadField label="Địa chỉ thuế" value={form.taxAddress} />
                </SimpleGrid>
                <Divider my="sm" />
                <ReadField label="Ghi chú" value={form.note} />
              </>
            )}
          </SectionWrapper>

          {/* Addresses */}
          <Card withBorder radius={4} p="lg" shadow="sm">
            <Group justify="space-between" mb="sm">
              <Group gap="xs">
                <ThemeIcon variant="light" size={30} radius={4}>
                  <IconMapPin size={18} />
                </ThemeIcon>
                <Title order={5}>Địa chỉ đã lưu</Title>
              </Group>
              <Button
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() =>
                  addrModal.openNew({
                    id: crypto.randomUUID(),
                    recipientName: "",
                    phoneNumber: "",
                    address: "",
                  })
                }
                radius={4}
              >
                Thêm địa chỉ
              </Button>
            </Group>
            <ScrollArea h={160} type="always" offsetScrollbars>
              <Group wrap="nowrap" align="flex-start">
                {form.addresses.map((a, i) => (
                  <Card
                    key={a.id}
                    withBorder
                    radius={4}
                    p="md"
                    miw={300}
                    style={{
                      borderTop: `${rem(4)} solid var(--mantine-color-green-6)`,
                    }}
                  >
                    <Group justify="space-between" mb={6}>
                      <Title order={6}>
                        {a.recipientName || "(Chưa đặt tên)"}
                      </Title>
                      <Group gap={6}>
                        <ActionIcon
                          variant="subtle"
                          onClick={() => addrModal.openFor(i, a)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() =>
                            setForm({
                              ...form,
                              addresses: form.addresses.filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    <Stack gap={6}>
                      <Group gap={6} c="dimmed">
                        <IconPhone size={14} />
                        <Text size="sm">{a.phoneNumber}</Text>
                      </Group>
                      <Group gap={6} c="dimmed">
                        <IconMapPin size={14} />
                        <Text size="sm">{a.address}</Text>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </Group>
            </ScrollArea>
          </Card>
        </Stack>

        {/* Right column */}
        <Stack gap="md">
          {/* Branches */}
          <Card withBorder radius={4} p="lg" shadow="sm">
            <Group justify="space-between" mb="sm">
              <Group gap="xs">
                <ThemeIcon variant="light" size={30} radius={4}>
                  <IconBuilding size={18} />
                </ThemeIcon>
                <Title order={5}>Chi nhánh</Title>
              </Group>
              <Button
                radius={4}
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() =>
                  branchModal.openNew({
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                    taxCode: "",
                    taxAddress: "",
                    note: "",
                  })
                }
              >
                Thêm chi nhánh
              </Button>
            </Group>
            <ScrollArea h={220} type="auto" offsetScrollbars>
              <Group wrap="nowrap" align="stretch">
                {form.branches.map((b, i) => (
                  <Card key={i} withBorder radius={4} p="md" miw={320}>
                    <Group justify="space-between">
                      <Title order={6}>{b.name || "(Chưa đặt tên)"}</Title>
                      <Group gap={6}>
                        <ActionIcon
                          variant="subtle"
                          onClick={() => branchModal.openFor(i, b)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() =>
                            setForm({
                              ...form,
                              branches: form.branches.filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    <List spacing={4} size="sm" center>
                      <List.Item
                        icon={
                          <ThemeIcon size={18} radius={4} variant="light">
                            <IconPhone size={14} />
                          </ThemeIcon>
                        }
                      >
                        {b.phone}
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon size={18} radius={4} variant="light">
                            <IconMail size={14} />
                          </ThemeIcon>
                        }
                      >
                        {b.email}
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon size={18} radius={4} variant="light">
                            <IconMapPin size={14} />
                          </ThemeIcon>
                        }
                      >
                        {b.address}
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon size={18} radius={4} variant="light">
                            <IconId size={14} />
                          </ThemeIcon>
                        }
                      >
                        MST: {b.taxCode}
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon size={18} radius={4} variant="light">
                            <IconTypography size={14} />
                          </ThemeIcon>
                        }
                      >
                        Địa chỉ thuế: {b.taxAddress}
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon size={18} radius={4} variant="light">
                            <IconNote size={14} />
                          </ThemeIcon>
                        }
                      >
                        {b.note}
                      </List.Item>
                    </List>
                  </Card>
                ))}
              </Group>
            </ScrollArea>
          </Card>

          {/* Banks */}
          <Card withBorder radius={4} p="lg" shadow="sm">
            <Group justify="space-between" mb="sm">
              <Group gap="xs">
                <ThemeIcon variant="light" size={30} radius={4}>
                  <IconBuildingBank size={18} />
                </ThemeIcon>
                <Title order={5}>Tài khoản ngân hàng</Title>
              </Group>
              <Button
                size="xs"
                radius={4}
                leftSection={<IconPlus size={14} />}
                onClick={() =>
                  bankModal.openNew({
                    bank: "",
                    accountHolder: "",
                    accountNumber: "",
                    branch: "",
                    note: "",
                  })
                }
              >
                Thêm tài khoản
              </Button>
            </Group>
            <Stack gap="sm">
              {form.banks.map((b, i) => (
                <Card key={i} withBorder radius={4} p="md">
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={6}>
                      <Group gap={8}>
                        <ThemeIcon variant="light" radius={4}>
                          <IconBuildingBank size={16} />
                        </ThemeIcon>
                        <Title order={6}>{b.bank || "(Chưa đặt)"}</Title>
                        <Badge variant="light">{b.branch}</Badge>
                      </Group>
                      <Group gap={12}>
                        <Group gap={6}>
                          <Text c="dimmed" size="sm">
                            Chủ TK:
                          </Text>
                          <Text size="sm">{b.accountHolder}</Text>
                        </Group>
                        <Divider orientation="vertical" />
                        <Group gap={6}>
                          <Text c="dimmed" size="sm">
                            Số TK:
                          </Text>
                          <Text size="sm">{b.accountNumber}</Text>
                          <Copyable text={b.accountNumber} />
                        </Group>
                      </Group>
                      {b.note && (
                        <Text c="dimmed" size="sm">
                          {b.note}
                        </Text>
                      )}
                    </Stack>
                    <Group gap={6}>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => bankModal.openFor(i, b)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() =>
                          setForm({
                            ...form,
                            banks: form.banks.filter((_, idx) => idx !== i),
                          })
                        }
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>

          {/* Contacts */}
          <Card withBorder radius={4} p="lg" shadow="sm">
            <Group justify="space-between" mb="sm">
              <Group gap="xs">
                <ThemeIcon variant="light" size={30} radius={4}>
                  <IconUser size={18} />
                </ThemeIcon>
                <Title order={5}>Liên hệ</Title>
              </Group>
              <Button
                size="xs"
                radius={4}
                leftSection={<IconPlus size={14} />}
                onClick={() =>
                  contactModal.openNew({
                    name: "",
                    phone: "",
                    email: "",
                    role: "",
                    organization: "",
                    address: "",
                    note: "",
                  })
                }
              >
                Thêm liên hệ
              </Button>
            </Group>
            <Stack gap="sm">
              {form.contacts.map((c, i) => (
                <Card key={i} withBorder radius={4} p="md">
                  <Group align="flex-start" justify="space-between">
                    <Group>
                      <Avatar radius={4} color="teal">
                        {c.name?.[0] || "?"}
                      </Avatar>
                      <Stack gap={4}>
                        <Title order={6}>{c.name || "(Chưa đặt tên)"}</Title>
                        <Group gap={10} c="dimmed" wrap="nowrap">
                          <Group gap={6}>
                            <IconPhone size={14} />
                            <Text size="sm">{c.phone}</Text>
                          </Group>
                          <Divider orientation="vertical" />
                          <Group gap={6}>
                            <IconMail size={14} />
                            <Text size="sm">{c.email}</Text>
                          </Group>
                        </Group>
                      </Stack>
                    </Group>
                    <Group gap={6}>
                      <Badge variant="light">{c.role || "—"}</Badge>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => contactModal.openFor(i, c)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() =>
                          setForm({
                            ...form,
                            contacts: form.contacts.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Divider my="sm" />
                  <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <ReadField label="Phòng ban" value={c.organization} />
                    <ReadField label="Địa chỉ" value={c.address} />
                    <ReadField label="Ghi chú" value={c.note} />
                  </SimpleGrid>
                </Card>
              ))}
            </Stack>
          </Card>
        </Stack>
      </SimpleGrid>

      {/* -------------------- Modals -------------------- */}
      <Modal
        opened={addrModal.open}
        onClose={addrModal.close}
        title="Địa chỉ"
        size="lg"
      >
        <Stack gap="xs">
          <TextInput
            radius={4}
            label="Tên người nhận / tiêu đề"
            value={addrModal.draft.recipientName}
            onChange={(e) =>
              addrModal.setDraft({
                ...addrModal.draft,
                recipientName: e.currentTarget.value,
              })
            }
          />
          <TextInput
            radius={4}
            label="Số điện thoại"
            value={addrModal.draft.phoneNumber}
            onChange={(e) =>
              addrModal.setDraft({
                ...addrModal.draft,
                phoneNumber: e.currentTarget.value,
              })
            }
          />
          <Textarea
            radius={4}
            label="Địa chỉ"
            value={addrModal.draft.address}
            onChange={(e) =>
              addrModal.setDraft({
                ...addrModal.draft,
                address: e.currentTarget.value,
              })
            }
          />
          <Group justify="flex-end">
            <Button radius={4} variant="default" onClick={addrModal.close}>
              Huỷ
            </Button>
            <Button
              radius={4}
              onClick={() => {
                setForm({
                  ...form,
                  addresses: upsertAt(
                    form.addresses,
                    addrModal.index,
                    addrModal.draft
                  ),
                });
                addrModal.close();
              }}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={branchModal.open}
        onClose={branchModal.close}
        title="Chi nhánh"
        size="lg"
      >
        <Stack>
          <TextInput
            radius={4}
            label="Tên chi nhánh"
            value={branchModal.draft.name}
            onChange={(e) =>
              branchModal.setDraft({
                ...branchModal.draft,
                name: e.currentTarget.value,
              })
            }
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              radius={4}
              label="Điện thoại"
              value={branchModal.draft.phone}
              onChange={(e) =>
                branchModal.setDraft({
                  ...branchModal.draft,
                  phone: e.currentTarget.value,
                })
              }
            />
            <TextInput
              radius={4}
              label="Email"
              value={branchModal.draft.email}
              onChange={(e) =>
                branchModal.setDraft({
                  ...branchModal.draft,
                  email: e.currentTarget.value,
                })
              }
            />
          </SimpleGrid>
          <Textarea
            radius={4}
            label="Địa chỉ"
            value={branchModal.draft.address}
            onChange={(e) =>
              branchModal.setDraft({
                ...branchModal.draft,
                address: e.currentTarget.value,
              })
            }
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              radius={4}
              label="Mã số thuế"
              value={branchModal.draft.taxCode}
              onChange={(e) =>
                branchModal.setDraft({
                  ...branchModal.draft,
                  taxCode: e.currentTarget.value,
                })
              }
            />
            <TextInput
              radius={4}
              label="Địa chỉ thuế"
              value={branchModal.draft.taxAddress}
              onChange={(e) =>
                branchModal.setDraft({
                  ...branchModal.draft,
                  taxAddress: e.currentTarget.value,
                })
              }
            />
          </SimpleGrid>
          <Textarea
            radius={4}
            label="Ghi chú"
            value={branchModal.draft.note}
            onChange={(e) =>
              branchModal.setDraft({
                ...branchModal.draft,
                note: e.currentTarget.value,
              })
            }
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={branchModal.close}>
              Huỷ
            </Button>
            <Button
              onClick={() => {
                setForm({
                  ...form,
                  branches: upsertAt(
                    form.branches,
                    branchModal.index,
                    branchModal.draft
                  ),
                });
                branchModal.close();
              }}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={bankModal.open}
        onClose={bankModal.close}
        title="Tài khoản ngân hàng"
        size="lg"
      >
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              radius={4}
              label="Ngân hàng"
              value={bankModal.draft.bank}
              onChange={(e) =>
                bankModal.setDraft({
                  ...bankModal.draft,
                  bank: e.currentTarget.value,
                })
              }
            />
            <TextInput
              radius={4}
              label="Chi nhánh"
              value={bankModal.draft.branch}
              onChange={(e) =>
                bankModal.setDraft({
                  ...bankModal.draft,
                  branch: e.currentTarget.value,
                })
              }
            />
          </SimpleGrid>
          <TextInput
            radius={4}
            label="Chủ tài khoản"
            value={bankModal.draft.accountHolder}
            onChange={(e) =>
              bankModal.setDraft({
                ...bankModal.draft,
                accountHolder: e.currentTarget.value,
              })
            }
          />
          <TextInput
            radius={4}
            label="Số tài khoản"
            value={bankModal.draft.accountNumber}
            onChange={(e) =>
              bankModal.setDraft({
                ...bankModal.draft,
                accountNumber: e.currentTarget.value,
              })
            }
          />
          <Textarea
            radius={4}
            label="Ghi chú"
            value={bankModal.draft.note}
            onChange={(e) =>
              bankModal.setDraft({
                ...bankModal.draft,
                note: e.currentTarget.value,
              })
            }
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={bankModal.close}>
              Huỷ
            </Button>
            <Button
              onClick={() => {
                setForm({
                  ...form,
                  banks: upsertAt(form.banks, bankModal.index, bankModal.draft),
                });
                bankModal.close();
              }}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={contactModal.open}
        onClose={contactModal.close}
        title="Liên hệ"
        size="lg"
      >
        <Stack>
          <TextInput
            radius={4}
            label="Họ tên"
            value={contactModal.draft.name}
            onChange={(e) =>
              contactModal.setDraft({
                ...contactModal.draft,
                name: e.currentTarget.value,
              })
            }
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              radius={4}
              label="Điện thoại"
              value={contactModal.draft.phone}
              onChange={(e) =>
                contactModal.setDraft({
                  ...contactModal.draft,
                  phone: e.currentTarget.value,
                })
              }
            />
            <TextInput
              radius={4}
              label="Email"
              value={contactModal.draft.email}
              onChange={(e) =>
                contactModal.setDraft({
                  ...contactModal.draft,
                  email: e.currentTarget.value,
                })
              }
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              radius={4}
              label="Chức vụ"
              value={contactModal.draft.role}
              onChange={(e) =>
                contactModal.setDraft({
                  ...contactModal.draft,
                  role: e.currentTarget.value,
                })
              }
            />
            <TextInput
              radius={4}
              label="Phòng ban"
              value={contactModal.draft.organization}
              onChange={(e) =>
                contactModal.setDraft({
                  ...contactModal.draft,
                  organization: e.currentTarget.value,
                })
              }
            />
          </SimpleGrid>
          <Textarea
            radius={4}
            label="Địa chỉ"
            value={contactModal.draft.address}
            onChange={(e) =>
              contactModal.setDraft({
                ...contactModal.draft,
                address: e.currentTarget.value,
              })
            }
          />
          <Textarea
            radius={4}
            label="Ghi chú"
            value={contactModal.draft.note}
            onChange={(e) =>
              contactModal.setDraft({
                ...contactModal.draft,
                note: e.currentTarget.value,
              })
            }
          />
          <Group justify="flex-end">
            <Button radius={4} variant="default" onClick={contactModal.close}>
              Huỷ
            </Button>
            <Button
              radius={4}
              onClick={() => {
                setForm({
                  ...form,
                  contacts: upsertAt(
                    form.contacts,
                    contactModal.index,
                    contactModal.draft
                  ),
                });
                contactModal.close();
              }}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
