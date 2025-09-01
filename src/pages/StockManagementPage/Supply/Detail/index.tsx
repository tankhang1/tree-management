import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Input,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  ScrollArea,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowLeft,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUser,
  IconTruckDelivery,
  IconInputSpark,
  IconCancel,
  IconTruck,
  IconSearch,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { SelectableSupplierCards } from "../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import AreaCard from "../../Delivery/Add/components/AreaCard";
import Table from "../../../../components/Table";
import { assetTypes } from "../Add";
import Scrollable from "../../../../components/Scrollable";
import { machineTypes } from "../../../PurchaseManagementPage/Material/Add";

type SupplyType = "nhập" | "xuất" | "hủy";
type SupplyStatus = "Nháp" | "Đã duyệt" | "Đã huỷ";

type Item = {
  id: string;
  name: string;
  category: string;
  unit: string;
  packaging?: string;
  qty: number;
  batch?: string;
  expDate?: string;
};

type Supply = {
  id: string;
  type: SupplyType;
  status: SupplyStatus;
  createdDate: Date;
  receiptNumber: string;
  invoiceNumber?: string;
  materialCategory: string;
  supplier?: string;
  areaGroup?: string;
  subArea?: string;
  warehouse?: string;
  handler: string;
  checker: string;
  note?: string;
  contract?: string;
  items: Item[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_COLOR: Record<SupplyStatus, string> = {
  Nháp: "gray",
  "Đã duyệt": "green",
  "Đã huỷ": "red",
};

const CONTRACTS = ["HD-001 - Công ty A", "HD-002 - Công ty B"];

const AREA_OPTIONS = [
  {
    parentId: "KV001",
    parentName: "Khu vực A",
    latitude: 10.762622,
    longitude: 106.660172,
    areaSize: 1200,
    note: "Gần hồ nước",
    children: [
      {
        id: "KV001-1",
        name: "Khu phụ A1",
        latitude: 10.763,
        longitude: 106.661,
        areaSize: 500,
      },
      {
        id: "KV001-2",
        name: "Khu phụ A2",
        latitude: 10.764,
        longitude: 106.662,
        areaSize: 700,
      },
    ],
  },
  {
    parentId: "KV002",
    parentName: "Khu vực B",
    latitude: 10.776889,
    longitude: 106.700806,
    areaSize: 900,
    note: "Không phân chia",
    children: [],
  },
];

const WAREHOUSES = [
  {
    id: "WH-SOUTH-01",
    name: "Kho miền Nam",
    areaGroup: "Khu vực A",
    subArea: "Khu phụ A1",
  },
  {
    id: "WH-SOUTH-02",
    name: "Kho miền Nam",
    areaGroup: "Khu vực A",
    subArea: "Khu phụ A2",
  },
];

const FieldRow = ({ label, value }: { label: string; value?: any }) => (
  <Group justify="space-between">
    <Text size="sm" c="dimmed">
      {label}
    </Text>
    <Text size="sm" fw={600}>
      {value ?? "—"}
    </Text>
  </Group>
);

const Section = ({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card withBorder radius={4} p="lg">
    <Group justify="space-between" mb="xs">
      <Title order={5}>{title}</Title>
      {right}
    </Group>
    <Divider my="xs" />
    {children}
  </Card>
);

export default function StockManagementSupplyDetailPage() {
  const navigate = useNavigate();

  const [supply, setSupply] = useState<Supply>({
    id: "PNK-20250715-001",
    type: "nhập",
    status: "Nháp",
    createdDate: new Date("2025-07-15"),
    receiptNumber: "PNK-20250715-001",
    invoiceNumber: "HD-789456",
    materialCategory: "Phân bón",
    supplier: "CTY Phân Bón Xanh",
    areaGroup: "Khu vực A",
    subArea: "Khu phụ A1",
    warehouse: "Kho miền Nam",
    handler: "Nguyễn Văn A",
    checker: "Trần Thị B",
    note: "Sử dụng trong đợt chăm bón tháng 8 cho vùng KV001-A1",
    contract: "HD-001 - Công ty A",
    items: [
      {
        id: "VT-001",
        name: "NPK 16-16-8",
        category: "Phân bón",
        unit: "bao",
        packaging: "Bao 50kg",
        qty: 60,
        batch: "BATCH-NPK-0715",
        expDate: "2026-07-15",
      },
      {
        id: "VT-002",
        name: "Kali KCl 61%",
        category: "Phân bón",
        unit: "bao",
        packaging: "Bao 25kg",
        qty: 40,
        batch: "BATCH-KCL-0715",
        expDate: "2027-03-30",
      },
    ],
    createdBy: "system",
    createdAt: "2025-07-15 09:10",
    updatedAt: "2025-07-15 09:10",
  });

  const totals = useMemo(
    () => ({
      lines: supply.items.length,
      qty: supply.items.reduce((a, b) => a + (b.qty || 0), 0),
    }),
    [supply.items]
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [which, setWhich] = useState<
    | "basic"
    | "location"
    | "supplier"
    | "items"
    | "people"
    | "contract"
    | "status"
    | null
  >(null);
  const [draft, setDraft] = useState<any>({});

  const openModal = (key: NonNullable<typeof which>) => {
    if (key === "basic")
      setDraft({
        type: supply.type,
        createdDate: supply.createdDate,
        receiptNumber: supply.receiptNumber,
        invoiceNumber: supply.invoiceNumber || "",
        materialCategory: supply.materialCategory,
        note: supply.note || "",
      });
    if (key === "location")
      setDraft({
        areaGroup: supply.areaGroup || "",
        subArea: supply.subArea || "",
        warehouse: supply.warehouse || "",
        selectedAreaIndex: supply.areaGroup === "Khu vực A" ? 0 : 1,
        selectedSubIndex:
          supply.subArea === "Khu phụ A1"
            ? 0
            : supply.subArea === "Khu phụ A2"
            ? 1
            : -1,
        selectedWarehouseId:
          WAREHOUSES.find((w) => w.name === supply.warehouse)?.id || "",
      });
    if (key === "supplier") setDraft({ supplier: supply.supplier || "" });
    if (key === "items")
      setDraft({
        rows: supply.items.map((r) => ({ ...r })),
        addRow: {
          id: "",
          name: "",
          category: supply.materialCategory,
          unit: "bao",
          packaging: "",
          qty: 0,
          batch: "",
          expDate: "",
        } as Item,
      });
    if (key === "people")
      setDraft({ handler: supply.handler, checker: supply.checker });
    if (key === "contract") setDraft({ contract: supply.contract || "" });
    if (key === "status") setDraft({ status: supply.status });
    setWhich(key);
    open();
  };

  const applyModal = () => {
    const touch = () => new Date().toISOString().replace("T", " ").slice(0, 16);
    if (which === "basic")
      setSupply((s) => ({
        ...s,
        type: draft.type,
        createdDate: draft.createdDate,
        receiptNumber: (draft.receiptNumber || "").trim(),
        invoiceNumber: (draft.invoiceNumber || "").trim() || undefined,
        materialCategory: draft.materialCategory,
        note: draft.note?.trim() || undefined,
        updatedAt: touch(),
      }));
    if (which === "location")
      setSupply((s) => ({
        ...s,
        areaGroup: draft.areaGroup || s.areaGroup,
        subArea: draft.subArea || s.subArea,
        warehouse:
          WAREHOUSES.find((w) => w.id === draft.selectedWarehouseId)?.name ||
          s.warehouse,
        updatedAt: touch(),
      }));
    if (which === "supplier")
      setSupply((s) => ({
        ...s,
        supplier: draft.supplier || undefined,
        updatedAt: touch(),
      }));
    if (which === "items")
      setSupply((s) => ({
        ...s,
        items: draft.rows,
        updatedAt: touch(),
      }));
    if (which === "people")
      setSupply((s) => ({
        ...s,
        handler: draft.handler || s.handler,
        checker: draft.checker || s.checker,
        updatedAt: touch(),
      }));
    if (which === "contract")
      setSupply((s) => ({
        ...s,
        contract: draft.contract || undefined,
        updatedAt: touch(),
      }));
    if (which === "status")
      setSupply((s) => ({
        ...s,
        status: draft.status,
        updatedAt: touch(),
      }));
    close();
  };

  return (
    <>
      <Card withBorder shadow="sm" radius={4} p="lg">
        <Group justify="space-between" align="flex-start" mb="md">
          <Group>
            <Button
              variant="subtle"
              radius={4}
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Stack gap={2}>
              <Title order={3}>Chi tiết phiếu xuất/nhập</Title>
              <Group gap={8} wrap="wrap">
                <Badge variant="dot">{supply.id}</Badge>
                <Badge color={STATUS_COLOR[supply.status]} variant="light">
                  {supply.status}
                </Badge>
                <Badge
                  variant="light"
                  color={
                    supply.type === "nhập"
                      ? "teal"
                      : supply.type === "xuất"
                      ? "blue"
                      : "red"
                  }
                >
                  {supply.type.toUpperCase()}
                </Badge>
              </Group>
            </Stack>
          </Group>
          <Group>
            <Button
              variant="default"
              radius={4}
              onClick={() => openModal("status")}
            >
              Trạng thái
            </Button>
            <Button radius={4} onClick={() => openModal("basic")}>
              Chỉnh sửa
            </Button>
          </Group>
        </Group>

        <Stack>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack>
                <Section
                  title="Tổng quan"
                  right={
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => openModal("basic")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <FieldRow
                        label="Ngày thực hiện"
                        value={supply.createdDate.toLocaleDateString()}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FieldRow label="Số phiếu" value={supply.receiptNumber} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FieldRow
                        label="Phân loại"
                        value={supply.materialCategory}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FieldRow
                        label="Hoá đơn"
                        value={supply.invoiceNumber || "—"}
                      />
                    </Grid.Col>
                  </Grid>
                  <Divider my="sm" />
                  <Stack gap={4}>
                    <Text size="sm" c="dimmed">
                      Ghi chú
                    </Text>
                    <Text size="sm">{supply.note || "Không có"}</Text>
                  </Stack>
                </Section>

                <Section
                  title="Khu vực & Kho"
                  right={
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => openModal("location")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <FieldRow label="Khu vực" value={supply.areaGroup} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FieldRow label="Khu phụ" value={supply.subArea || "—"} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FieldRow label="Kho" value={supply.warehouse || "—"} />
                    </Grid.Col>
                  </Grid>
                </Section>

                <Section
                  title="Nhà cung cấp"
                  right={
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => openModal("supplier")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <FieldRow label="Đơn vị" value={supply.supplier || "—"} />
                </Section>

                <Section
                  title="Hợp đồng"
                  right={
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => openModal("contract")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <FieldRow
                    label="Số hợp đồng"
                    value={supply.contract || "—"}
                  />
                </Section>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack>
                <Section
                  title="Nhân sự"
                  right={
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => openModal("people")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <FieldRow label="Người xử lý" value={supply.handler} />
                  <FieldRow label="Người kiểm tra" value={supply.checker} />
                </Section>

                <Section
                  title="Tổng hợp"
                  right={
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => openModal("items")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  }
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <FieldRow label="Số dòng" value={totals.lines} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FieldRow label="Tổng SL" value={totals.qty} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FieldRow label="Tạo lúc" value={supply.createdAt} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <FieldRow label="Cập nhật" value={supply.updatedAt} />
                    </Grid.Col>
                  </Grid>
                </Section>
              </Stack>
            </Grid.Col>
          </Grid>

          <Section
            title="Danh sách vật tư"
            right={
              <Button
                size="xs"
                radius={4}
                leftSection={<IconPlus size={14} />}
                onClick={() => openModal("items")}
              >
                Quản lý
              </Button>
            }
          >
            <Table
              data={supply.items}
              columns={[
                { accessorKey: "id", header: "Mã" },
                { accessorKey: "name", header: "Tên" },
                { accessorKey: "category", header: "Loại" },
                { accessorKey: "packaging", header: "Quy cách" },
                { accessorKey: "unit", header: "ĐVT" },
                { accessorKey: "qty", header: "SL" },
                { accessorKey: "batch", header: "Lô" },
                { accessorKey: "expDate", header: "HSD" },
              ]}
            />
          </Section>
        </Stack>
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        centered
        radius={4}
        size="lg"
        title={<Title order={5}>Chỉnh sửa</Title>}
      >
        {which === "basic" && (
          <Stack>
            <SegmentedControl
              radius={4}
              value={draft.type}
              onChange={(v) => setDraft({ ...draft, type: v })}
              data={[
                {
                  value: "nhập",
                  label: (
                    <Group gap={6}>
                      <IconInputSpark size={14} /> <Text size="sm">Nhập</Text>
                    </Group>
                  ),
                },
                {
                  value: "xuất",
                  label: (
                    <Group gap={6}>
                      <IconTruckDelivery size={14} />{" "}
                      <Text size="sm">Xuất</Text>
                    </Group>
                  ),
                },
                {
                  value: "hủy",
                  label: (
                    <Group gap={6}>
                      <IconCancel size={14} /> <Text size="sm">Huỷ</Text>
                    </Group>
                  ),
                },
              ]}
            />
            <DatePickerInput
              label="Ngày thực hiện"
              value={draft.createdDate}
              onChange={(v) => setDraft({ ...draft, createdDate: v })}
              radius={4}
            />
            <Group grow>
              <TextInput
                label="Số phiếu"
                value={draft.receiptNumber}
                onChange={(e) =>
                  setDraft({ ...draft, receiptNumber: e.currentTarget.value })
                }
                radius={4}
              />
              <TextInput
                label="Hoá đơn"
                value={draft.invoiceNumber}
                onChange={(e) =>
                  setDraft({ ...draft, invoiceNumber: e.currentTarget.value })
                }
                radius={4}
              />
            </Group>
            <Select
              label="Phân loại vật tư"
              data={["Phân bón", "Thuốc BVTV", "Vật tư", "Máy móc"]}
              value={draft.materialCategory}
              onChange={(v) => setDraft({ ...draft, materialCategory: v })}
              radius={4}
            />
            <Textarea
              label="Ghi chú"
              minRows={3}
              value={draft.note}
              onChange={(e) =>
                setDraft({ ...draft, note: e.currentTarget.value })
              }
              radius={4}
            />
            <Group justify="flex-end">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {which === "location" && (
          <Stack>
            <Title order={6}>Khu vực</Title>
            <Grid>
              {AREA_OPTIONS.map((group, index) => (
                <Grid.Col span={{ base: 12, sm: 6 }} key={group.parentId}>
                  <Card
                    withBorder
                    shadow="xs"
                    radius={4}
                    p="md"
                    style={{
                      cursor: "pointer",
                      borderColor:
                        draft.selectedAreaIndex === index ? "green" : undefined,
                    }}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        selectedAreaIndex: index,
                        areaGroup: group.parentName,
                        selectedSubIndex: -1,
                      })
                    }
                  >
                    <Group justify="space-between">
                      <Text fw={600}>{group.parentName}</Text>
                      <Badge variant="light">{group.parentId}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {group.note}
                    </Text>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>

            <Title order={6}>Khu phụ</Title>
            <Group>
              {(AREA_OPTIONS[draft.selectedAreaIndex || 0]?.children || []).map(
                (sub: any, idx: number) => (
                  <AreaCard
                    key={sub.id}
                    isCheckbox
                    {...sub}
                    selected={draft.selectedSubIndex === idx}
                    onToggle={() =>
                      setDraft({
                        ...draft,
                        selectedSubIndex: idx,
                        subArea: sub.name,
                      })
                    }
                    closable={false}
                  />
                )
              )}
            </Group>

            <Title order={6}>Kho</Title>
            <Select
              radius={4}
              data={WAREHOUSES.map((w) => ({
                value: w.id,
                label: `${w.name} • ${w.subArea}`,
              }))}
              value={draft.selectedWarehouseId}
              onChange={(v) => setDraft({ ...draft, selectedWarehouseId: v })}
              placeholder="Chọn kho"
            />

            <Group justify="flex-end" mt="sm">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {which === "supplier" && (
          <Stack>
            <Text size="sm" c="dimmed">
              Chọn nhà cung cấp
            </Text>
            <TextInput
              placeholder="Tìm kiếm nhà cung cấp"
              radius={4}
              onChange={() => {}}
              leftSection={<IconUser size={16} />}
            />
            <SelectableSupplierCards isCheckbox />
            <Group>
              <TextInput
                label="Ghi nhận nhanh"
                placeholder="Hoặc nhập tên nhà cung cấp"
                value={draft.supplier}
                onChange={(e) =>
                  setDraft({ ...draft, supplier: e.currentTarget.value })
                }
                radius={4}
              />
            </Group>
            <Group justify="flex-end">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {which === "items" && (
          <Stack>
            <Paper withBorder radius={4} p="sm">
              <Table
                columns={[
                  { accessorKey: "id", header: "Mã" },
                  { accessorKey: "name", header: "Tên" },
                  { accessorKey: "category", header: "Loại" },
                  { accessorKey: "packaging", header: "Quy cách" },
                  { accessorKey: "unit", header: "ĐVT" },
                  { accessorKey: "qty", header: "SL" },
                  { accessorKey: "batch", header: "Lô" },
                  { accessorKey: "expDate", header: "HSD" },
                  {
                    accessorKey: "actions",
                    header: "",
                    Cell: ({ row }) => (
                      <ActionIcon
                        color="red"
                        variant="light"
                        radius={4}
                        onClick={() => {
                          const arr = [...draft.rows];
                          arr.splice(row.index, 1);
                          setDraft({ ...draft, rows: arr });
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    ),
                  },
                ]}
                data={draft.rows}
              />
            </Paper>

            <Card withBorder radius={4} p="md">
              <Title order={6} mb="xs">
                Thêm dòng
              </Title>
              <Card radius={4} withBorder>
                <Stack>
                  <Input.Wrapper label="Loại tài sản">
                    <Group gap="sm" wrap="wrap">
                      {assetTypes.map((type, index) => (
                        <Button
                          key={type.value}
                          leftSection={type.icon}
                          radius={4}
                          variant={index === 0 ? "filled" : "outline"}
                        >
                          {type.label}
                        </Button>
                      ))}
                    </Group>
                  </Input.Wrapper>
                  <Select
                    searchable
                    clearable
                    radius={4}
                    label="Loại máy móc thiết bị"
                    placeholder="Tìm kiếm loại máy móc thiết bị"
                    leftSection={<IconTruck size={18} />}
                    data={[
                      { value: "MCH01", label: "Máy cày Kubota" },
                      { value: "MCH02", label: "Máy phun thuốc Honda" },
                      {
                        value: "MCH03",
                        label: "Máy gặt đập liên hợp Yanmar",
                      },
                      {
                        value: "MCH04",
                        label: "Máy bay nông nghiệp DJI Agras",
                      },
                      {
                        value: "MCH05",
                        label: "Máy bơm nước Honda WB20XT",
                      },
                      { value: "MCH06", label: "Máy trộn bê tông 250L" },
                    ]}
                  />
                  <TextInput
                    label="Máy móc thiết bị"
                    placeholder="Tìm kiếm máy móc thiết bị"
                    radius={4}
                    leftSection={<IconSearch size={18} />}
                  />
                  <Scrollable h={150}>
                    <Group gap="md" wrap="nowrap" p={"xs"}>
                      {machineTypes.map((machine, index) => (
                        <Card
                          key={index}
                          withBorder
                          h={150}
                          miw={300}
                          shadow="sm"
                          radius="md"
                          p="md"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <Group grow>
                            <Image
                              src={
                                "https://via.placeholder.com/150" // Placeholder nếu không có hình ảnh
                              }
                              alt={machine.name}
                              w={100}
                              h={100}
                              radius="md"
                            />
                            <Stack>
                              <Text fw={500} size="lg">
                                {machine.name}
                              </Text>
                              <Text size="sm" color="dimmed">
                                Mã: {machine.id}
                              </Text>
                            </Stack>
                          </Group>
                        </Card>
                      ))}
                    </Group>
                  </Scrollable>
                  <Group grow>
                    <NumberInput
                      label="Số lượng"
                      min={1}
                      hideControls
                      radius={4}
                    />
                    <MultiSelect
                      label="Quy cách"
                      radius={4}
                      placeholder="Quy cách"
                      data={[
                        {
                          value: "PKG001",
                          label: "Hộp giấy nhỏ (50 cái)",
                        },
                        {
                          value: "PKG002",
                          label: "Túi nilon lớn (100 cái)",
                        },
                        {
                          value: "PKG003",
                          label: "Bao tải 25kg (25 cái)",
                        },
                        {
                          value: "PKG004",
                          label: "Bịch nhựa 1kg (10 cái)",
                        },
                        {
                          value: "PKG005",
                          label: "Thùng carton lớn (20 cái)",
                        },
                        {
                          value: "PKG006",
                          label: "Hộp nhựa 500ml (30 cái)",
                        },
                      ]}
                    />
                  </Group>
                </Stack>
              </Card>
            </Card>

            <Group justify="flex-end">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {which === "people" && (
          <Stack>
            <Group grow>
              <TextInput
                label="Người xử lý"
                value={draft.handler}
                onChange={(e) =>
                  setDraft({ ...draft, handler: e.currentTarget.value })
                }
                radius={4}
              />
              <TextInput
                label="Người kiểm tra"
                value={draft.checker}
                onChange={(e) =>
                  setDraft({ ...draft, checker: e.currentTarget.value })
                }
                radius={4}
              />
            </Group>
            <Title order={6}>Chọn nhanh từ danh sách</Title>
            <EmployeeCardList isMultiple />
            <Group justify="flex-end">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {which === "contract" && (
          <Stack>
            <Select
              label="Số hợp đồng"
              searchable
              clearable
              data={CONTRACTS}
              value={draft.contract}
              onChange={(v) => setDraft({ ...draft, contract: v })}
              radius={4}
            />
            <Group justify="flex-end">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button radius={4} onClick={applyModal}>
                Lưu
              </Button>
            </Group>
          </Stack>
        )}

        {which === "status" && (
          <Stack>
            <SegmentedControl
              radius={4}
              value={draft.status}
              onChange={(v) => setDraft({ ...draft, status: v })}
              data={[
                { value: "Nháp", label: "Nháp" },
                { value: "Đã duyệt", label: "Đã duyệt" },
                { value: "Đã huỷ", label: "Đã huỷ" },
              ]}
            />
            <Textarea
              label="Ghi chú"
              placeholder="Lý do thay đổi trạng thái…"
              minRows={3}
              radius={4}
            />
            <Group justify="flex-end">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button
                color={
                  draft.status === "Đã duyệt"
                    ? "green"
                    : draft.status === "Đã huỷ"
                    ? "red"
                    : "gray"
                }
                radius={4}
                onClick={applyModal}
              >
                Cập nhật
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
