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
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  IconArrowLeft,
  IconEdit,
  IconPhoto,
  IconUpload,
  IconX,
  IconSearch,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableSupplierCards } from "../Add/components/SelectableSupplierCards";

type DiscountTier = { minQty: number; price: number };
type Lot = {
  lot: string;
  qty: number;
  mfgDate?: Date | null;
  expDate?: Date | null;
  location?: string;
};

type RawMaterial = {
  code: string;
  name: string;
  category: string;
  tags: string[];
  unit: string;
  specs: string[];
  note: string;
  imageUrl: string;
  supplier: {
    name: string;
    phone: string;
    email?: string;
    leadTimeDays?: number;
    moq?: number;
  };
  pricing: {
    unitCost: number;
    currency: "VND" | "USD";
    vatPercent: number;
    discountTiers: DiscountTier[];
  };
  inventory: {
    stock: number;
    minStock: number;
    warehouse: string;
    location?: string;
    lotTracking: boolean;
    lots: Lot[];
  };
  specsDetailed: {
    materialType: "Nitrile" | "Latex" | "Vinyl";
    thicknessMil: number;
    lengthMm: number;
    sizes: string[];
    color: string;
    powderFree: boolean;
    textured: boolean;
    ambidextrous: boolean;
    applications: string[];
    storage: string;
  };
  compliance: {
    standards: string[];
    ppeCategory: "Cat I" | "Cat II" | "Cat III";
    foodSafe: boolean;
    msds: boolean;
    coa: boolean;
    countryOfOrigin: string;
    hazardClass: string;
    shelfLifeMonths: number;
    lastInspection?: Date | null;
  };
};

const FieldRow = ({ label, value }: { label: string; value?: any }) => (
  <Group justify="space-between">
    <Text c="dimmed" size="sm">
      {label}
    </Text>
    <Text fw={600} size="sm">
      {value ?? "—"}
    </Text>
  </Group>
);

const Section = ({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
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

export default function ProductManagementRawMaterialDetailPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<RawMaterial>({
    code: "VT-GLV-NIT-M",
    name: "Bao tay Nitrile không bột (Powder-free)",
    category: "Đồ bảo hộ lao động",
    tags: ["BVTV", "Vệ sinh", "Thực phẩm", "Không bột"],
    unit: "Hộp",
    specs: ["Size M/L/XL", "Nitrile 4 mil", "Dài 240mm", "Mặt nhám đầu ngón"],
    note: "Phù hợp thu hoạch, làm vườn, xử lý thuốc BVTV nhẹ; dùng một lần.",
    imageUrl:
      "https://product.hstatic.net/200000033050/product/gang-tay-vglove-nitrile_4e70a201f9c946058ac9257662a65ea2.jpg",
    supplier: {
      name: "Công ty Bảo Hộ Nông Nghiệp",
      phone: "0909 123 456",
      email: "sales@baohonongnghiep.vn",
      leadTimeDays: 7,
      moq: 50,
    },
    pricing: {
      unitCost: 65000,
      currency: "VND",
      vatPercent: 8,
      discountTiers: [
        { minQty: 100, price: 62000 },
        { minQty: 500, price: 59000 },
      ],
    },
    inventory: {
      stock: 320,
      minStock: 80,
      warehouse: "Kho B",
      location: "Kệ B-02",
      lotTracking: true,
      lots: [
        {
          lot: "GLV-2407-A",
          qty: 120,
          mfgDate: new Date("2024-07-10"),
          expDate: new Date("2027-07-10"),
          location: "B-02-1",
        },
        {
          lot: "GLV-2405-C",
          qty: 200,
          mfgDate: new Date("2024-05-22"),
          expDate: new Date("2027-05-22"),
          location: "B-02-2",
        },
      ],
    },
    specsDetailed: {
      materialType: "Nitrile",
      thicknessMil: 4,
      lengthMm: 240,
      sizes: ["M", "L", "XL"],
      color: "Xanh dương",
      powderFree: true,
      textured: true,
      ambidextrous: true,
      applications: ["Thu hoạch", "Pha BVTV", "Sơ chế thực phẩm", "Vệ sinh"],
      storage: "Bảo quản nơi khô mát 10–30°C, tránh ánh nắng trực tiếp.",
    },
    compliance: {
      standards: ["EN 374", "EN 388", "EN 455"],
      ppeCategory: "Cat III",
      foodSafe: true,
      msds: true,
      coa: true,
      countryOfOrigin: "Malaysia",
      hazardClass: "Không phân loại nguy hiểm",
      shelfLifeMonths: 36,
      lastInspection: new Date("2025-06-20"),
    },
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [modalType, setModalType] = useState<
    | "basic"
    | "media"
    | "specs"
    | "supplier"
    | "pricing"
    | "inventory"
    | "compliance"
    | "lots"
    | null
  >(null);
  const [draft, setDraft] = useState<any>({});

  const money = (n: number, cur: "VND" | "USD" = data.pricing.currency) =>
    (n ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
    (cur === "VND" ? " ₫" : " $");
  const vatAdded = Math.round(
    data.pricing.unitCost * (1 + (data.pricing.vatPercent || 0) / 100)
  );

  const openModal = (type: NonNullable<typeof modalType>) => {
    if (type === "basic")
      setDraft({
        code: data.code,
        name: data.name,
        category: data.category,
        unit: data.unit,
        note: data.note,
        tags: [...data.tags],
      });
    if (type === "media")
      setDraft({ imageUrl: data.imageUrl, tags: [...data.tags] });
    if (type === "specs")
      setDraft({
        specs: [...data.specs],
        materialType: data.specsDetailed.materialType,
        thicknessMil: data.specsDetailed.thicknessMil,
        lengthMm: data.specsDetailed.lengthMm,
        sizes: [...data.specsDetailed.sizes],
        color: data.specsDetailed.color,
        powderFree: data.specsDetailed.powderFree,
        textured: data.specsDetailed.textured,
        ambidextrous: data.specsDetailed.ambidextrous,
        applications: [...data.specsDetailed.applications],
        storage: data.specsDetailed.storage,
      });
    if (type === "supplier")
      setDraft({
        supplier: { ...data.supplier },
        search: "",
      });
    if (type === "pricing")
      setDraft({
        unitCost: data.pricing.unitCost,
        currency: data.pricing.currency,
        vatPercent: data.pricing.vatPercent,
        tiers: data.pricing.discountTiers.map((t) => ({ ...t })),
      });
    if (type === "inventory")
      setDraft({
        stock: data.inventory.stock,
        minStock: data.inventory.minStock,
        warehouse: data.inventory.warehouse,
        location: data.inventory.location,
        lotTracking: data.inventory.lotTracking,
      });
    if (type === "compliance")
      setDraft({
        standards: [...data.compliance.standards],
        ppeCategory: data.compliance.ppeCategory,
        foodSafe: data.compliance.foodSafe,
        msds: data.compliance.msds,
        coa: data.compliance.coa,
        countryOfOrigin: data.compliance.countryOfOrigin,
        hazardClass: data.compliance.hazardClass,
        shelfLifeMonths: data.compliance.shelfLifeMonths,
        lastInspection: data.compliance.lastInspection,
      });
    if (type === "lots")
      setDraft({
        lots: data.inventory.lots.map((l) => ({ ...l })),
      });
    setModalType(type);
    open();
  };

  const applyModal = () => {
    if (modalType === "basic")
      setData((s) => ({
        ...s,
        code: draft.code,
        name: draft.name,
        category: draft.category,
        unit: draft.unit,
        note: draft.note,
        tags: draft.tags ?? [],
      }));
    if (modalType === "media")
      setData((s) => ({
        ...s,
        imageUrl: draft.imageUrl,
        tags: draft.tags ?? [],
      }));
    if (modalType === "specs")
      setData((s) => ({
        ...s,
        specs: draft.specs ?? [],
        specsDetailed: {
          ...s.specsDetailed,
          materialType: draft.materialType,
          thicknessMil: Number(draft.thicknessMil) || 0,
          lengthMm: Number(draft.lengthMm) || 0,
          sizes: draft.sizes ?? [],
          color: draft.color,
          powderFree: !!draft.powderFree,
          textured: !!draft.textured,
          ambidextrous: !!draft.ambidextrous,
          applications: draft.applications ?? [],
          storage: draft.storage,
        },
      }));
    if (modalType === "supplier")
      setData((s) => ({
        ...s,
        supplier: { ...(draft.supplier ?? s.supplier) },
      }));
    if (modalType === "pricing")
      setData((s) => ({
        ...s,
        pricing: {
          unitCost: Number(draft.unitCost) || 0,
          currency: draft.currency,
          vatPercent: Number(draft.vatPercent) || 0,
          discountTiers: (draft.tiers ?? []) as DiscountTier[],
        },
      }));
    if (modalType === "inventory")
      setData((s) => ({
        ...s,
        inventory: {
          ...s.inventory,
          stock: Number(draft.stock) || 0,
          minStock: Number(draft.minStock) || 0,
          warehouse: draft.warehouse,
          location: draft.location,
          lotTracking: !!draft.lotTracking,
          lots: s.inventory.lots,
        },
      }));
    if (modalType === "compliance")
      setData((s) => ({
        ...s,
        compliance: {
          standards: draft.standards ?? [],
          ppeCategory: draft.ppeCategory,
          foodSafe: !!draft.foodSafe,
          msds: !!draft.msds,
          coa: !!draft.coa,
          countryOfOrigin: draft.countryOfOrigin,
          hazardClass: draft.hazardClass,
          shelfLifeMonths: Number(draft.shelfLifeMonths) || 0,
          lastInspection: draft.lastInspection,
        },
      }));
    if (modalType === "lots")
      setData((s) => ({
        ...s,
        inventory: { ...s.inventory, lots: draft.lots ?? [] },
      }));
    close();
  };

  return (
    <>
      <Card withBorder shadow="sm" radius={4} p="lg">
        <Group justify="space-between" mb="md" align="flex-start">
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
              <Title order={3}>Chi tiết nguyên vật liệu</Title>
              <Group gap={8} wrap="wrap">
                <Badge>{data.category}</Badge>
                <Badge>{data.unit}/hộp</Badge>
                {data.tags.map((t) => (
                  <Badge key={t} variant="light">
                    {t}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Group>
        </Group>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack>
              <Section
                title="Thông tin cơ bản"
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
                  <Grid.Col span={{ base: 12, sm: 7 }}>
                    <SimpleGrid cols={1} spacing="sm">
                      <FieldRow label="Mã" value={data.code} />
                      <FieldRow label="Tên" value={data.name} />
                      <FieldRow label="Loại" value={data.category} />
                      <FieldRow label="Quy cách" value={data.unit} />
                    </SimpleGrid>
                    <Divider my="sm" />
                    <Text size="sm" c="dimmed">
                      Ghi chú
                    </Text>
                    <Text>{data.note || "—"}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 5 }}>
                    <Card withBorder radius={4} p="xs">
                      <Image
                        src={data.imageUrl}
                        alt={data.name}
                        radius={4}
                        h={220}
                        fit="contain"
                      />
                    </Card>
                  </Grid.Col>
                </Grid>
              </Section>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
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
              <SimpleGrid cols={2} spacing="sm">
                <FieldRow label="Tên" value={data.supplier.name} />
                <FieldRow label="Điện thoại" value={data.supplier.phone} />
                <FieldRow label="Email" value={data.supplier.email || "—"} />
                <FieldRow
                  label="Thời gian giao (ngày)"
                  value={data.supplier.leadTimeDays}
                />
                <FieldRow label="Số lượng" value={data.supplier.moq} />
              </SimpleGrid>
            </Section>
          </Grid.Col>
        </Grid>
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        centered
        radius={4}
        size="lg"
        title={<Title order={5}>Chỉnh sửa</Title>}
      >
        {modalType === "basic" && (
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput
                label="Mã"
                value={draft.code}
                onChange={(e) =>
                  setDraft({ ...draft, code: e.currentTarget.value })
                }
                radius={4}
              />
              <TextInput
                label="Tên"
                value={draft.name}
                onChange={(e) =>
                  setDraft({ ...draft, name: e.currentTarget.value })
                }
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <Select
                label="Loại"
                value={draft.category}
                onChange={(v) => setDraft({ ...draft, category: v })}
                data={[
                  "Đồ bảo hộ lao động",
                  "Phân bón",
                  "Thuốc BVTV",
                  "Dụng cụ nông nghiệp",
                  "Bao bì/Đóng gói",
                ]}
                searchable
                clearable
                radius={4}
              />
              <Select
                label="Quy cách"
                value={draft.unit}
                onChange={(v) => setDraft({ ...draft, unit: v })}
                data={["Cái", "Đôi", "Hộp", "Thùng"]}
                radius={4}
              />
            </SimpleGrid>
            <MultiSelect
              label="Thẻ"
              value={draft.tags}
              onChange={(v) => setDraft({ ...draft, tags: v })}
              data={[
                "BVTV",
                "Vệ sinh",
                "Thực phẩm",
                "Không bột",
                "Chống hóa chất",
              ]}
              searchable
              clearable
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

        {modalType === "media" && (
          <Stack>
            <Input.Wrapper label="Cập nhật ảnh">
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={(files) =>
                  setDraft({
                    ...draft,
                    imageUrl: URL.createObjectURL(files[0]),
                  })
                }
                maxSize={5 * 1024 ** 2}
                radius={4}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={140}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload size={46} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={46} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={46} />
                  </Dropzone.Idle>
                  <div>
                    <Text size="lg">Kéo thả hoặc bấm để tải ảnh</Text>
                    <Text size="sm" c="dimmed">
                      Tối đa 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </Input.Wrapper>
            <Card withBorder radius={4} p="xs">
              <Image
                src={draft.imageUrl || data.imageUrl}
                radius={4}
                h={220}
                fit="contain"
              />
            </Card>
            <MultiSelect
              label="Thẻ"
              value={draft.tags}
              onChange={(v) => setDraft({ ...draft, tags: v })}
              data={[
                "BVTV",
                "Vệ sinh",
                "Thực phẩm",
                "Không bột",
                "Chống hóa chất",
              ]}
              searchable
              clearable
              radius={4}
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

        {modalType === "specs" && (
          <Stack>
            <SimpleGrid cols={2}>
              <Select
                label="Chất liệu"
                value={draft.materialType}
                onChange={(v) => setDraft({ ...draft, materialType: v })}
                data={["Nitrile", "Latex", "Vinyl"]}
                radius={4}
              />
              <TextInput
                label="Màu"
                value={draft.color}
                onChange={(e) =>
                  setDraft({ ...draft, color: e.currentTarget.value })
                }
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <NumberInput
                label="Độ dày (mil)"
                value={draft.thicknessMil}
                onChange={(v) =>
                  setDraft({ ...draft, thicknessMil: Number(v) })
                }
                min={1}
                step={0.5}
                radius={4}
              />
              <NumberInput
                label="Chiều dài (mm)"
                value={draft.lengthMm}
                onChange={(v) => setDraft({ ...draft, lengthMm: Number(v) })}
                min={200}
                step={10}
                radius={4}
              />
              <MultiSelect
                label="Size"
                value={draft.sizes}
                onChange={(v) => setDraft({ ...draft, sizes: v })}
                data={["S", "M", "L", "XL"]}
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <Switch
                label="Không bột"
                checked={draft.powderFree}
                onChange={(e) =>
                  setDraft({ ...draft, powderFree: e.currentTarget.checked })
                }
              />
              <Switch
                label="Nhám"
                checked={draft.textured}
                onChange={(e) =>
                  setDraft({ ...draft, textured: e.currentTarget.checked })
                }
              />
              <Switch
                label="Hai tay"
                checked={draft.ambidextrous}
                onChange={(e) =>
                  setDraft({ ...draft, ambidextrous: e.currentTarget.checked })
                }
              />
            </SimpleGrid>
            <MultiSelect
              label="Ứng dụng"
              value={draft.applications}
              onChange={(v) => setDraft({ ...draft, applications: v })}
              data={["Thu hoạch", "Pha BVTV", "Sơ chế thực phẩm", "Vệ sinh"]}
              searchable
              clearable
              radius={4}
            />
            <Textarea
              label="Bảo quản"
              minRows={2}
              value={draft.storage}
              onChange={(e) =>
                setDraft({ ...draft, storage: e.currentTarget.value })
              }
              radius={4}
            />
            <MultiSelect
              label="Quy cách hiển thị"
              value={draft.specs}
              onChange={(v) => setDraft({ ...draft, specs: v })}
              data={[
                "Size M/L/XL",
                "Nitrile 4 mil",
                "Dài 240mm",
                "Mặt nhám đầu ngón",
              ]}
              searchable
              clearable
              radius={4}
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

        {modalType === "supplier" && (
          <Stack>
            <TextInput
              label="Tìm nhà cung cấp"
              placeholder="Nhập tên/điện thoại/email"
              leftSection={<IconSearch size={16} />}
              radius={4}
              onChange={(e) =>
                setDraft({ ...draft, search: e.currentTarget.value })
              }
            />
            <SelectableSupplierCards isMultiple={false} isCheckbox={false} />
            <SimpleGrid cols={2}>
              <TextInput
                label="Tên NCC"
                value={draft.supplier?.name}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    supplier: {
                      ...(draft.supplier ?? {}),
                      name: e.currentTarget.value,
                    },
                  })
                }
                radius={4}
              />
              <TextInput
                label="Điện thoại"
                value={draft.supplier?.phone}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    supplier: {
                      ...(draft.supplier ?? {}),
                      phone: e.currentTarget.value,
                    },
                  })
                }
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput
                label="Email"
                value={draft.supplier?.email}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    supplier: {
                      ...(draft.supplier ?? {}),
                      email: e.currentTarget.value,
                    },
                  })
                }
                radius={4}
              />
              <NumberInput
                label="Lead time (ngày)"
                value={draft.supplier?.leadTimeDays}
                onChange={(v) =>
                  setDraft({
                    ...draft,
                    supplier: {
                      ...(draft.supplier ?? {}),
                      leadTimeDays: Number(v),
                    },
                  })
                }
                min={0}
                radius={4}
              />
            </SimpleGrid>
            <NumberInput
              label="Số lượng"
              value={draft.supplier?.moq}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  supplier: { ...(draft.supplier ?? {}), moq: Number(v) },
                })
              }
              min={0}
              radius={4}
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

        {modalType === "pricing" && (
          <Stack>
            <SimpleGrid cols={3}>
              <NumberInput
                label="Giá nhập"
                value={draft.unitCost}
                onChange={(v) => setDraft({ ...draft, unitCost: Number(v) })}
                min={0}
                thousandSeparator=","
                radius={4}
              />
              <Select
                label="Tiền tệ"
                value={draft.currency}
                onChange={(v) => setDraft({ ...draft, currency: v })}
                data={["VND", "USD"]}
                radius={4}
              />
              <NumberInput
                label="VAT (%)"
                value={draft.vatPercent}
                onChange={(v) => setDraft({ ...draft, vatPercent: Number(v) })}
                min={0}
                max={20}
                radius={4}
              />
            </SimpleGrid>
            <Divider label="Bậc chiết khấu" />
            <Stack>
              {(draft.tiers ?? []).map((t: DiscountTier, idx: number) => (
                <Group key={idx} align="end">
                  <NumberInput
                    label="SL tối thiểu"
                    value={t.minQty}
                    onChange={(v) => {
                      const tiers = [...draft.tiers];
                      tiers[idx] = { ...tiers[idx], minQty: Number(v) || 0 };
                      setDraft({ ...draft, tiers });
                    }}
                    min={0}
                    radius={4}
                  />
                  <NumberInput
                    label="Giá"
                    value={t.price}
                    onChange={(v) => {
                      const tiers = [...draft.tiers];
                      tiers[idx] = { ...tiers[idx], price: Number(v) || 0 };
                      setDraft({ ...draft, tiers });
                    }}
                    min={0}
                    thousandSeparator=","
                    radius={4}
                  />
                  <ActionIcon
                    color="red"
                    variant="light"
                    radius={4}
                    onClick={() => {
                      const tiers = [...draft.tiers];
                      tiers.splice(idx, 1);
                      setDraft({ ...draft, tiers });
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                radius={4}
                onClick={() =>
                  setDraft({
                    ...draft,
                    tiers: [...(draft.tiers ?? []), { minQty: 0, price: 0 }],
                  })
                }
              >
                Thêm bậc
              </Button>
            </Stack>
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

        {modalType === "inventory" && (
          <Stack>
            <SimpleGrid cols={2}>
              <NumberInput
                label="Tồn kho"
                value={draft.stock}
                onChange={(v) => setDraft({ ...draft, stock: Number(v) })}
                min={0}
                radius={4}
              />
              <NumberInput
                label="Tồn tối thiểu"
                value={draft.minStock}
                onChange={(v) => setDraft({ ...draft, minStock: Number(v) })}
                min={0}
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <Select
                label="Kho"
                value={draft.warehouse}
                onChange={(v) => setDraft({ ...draft, warehouse: v })}
                data={["Kho A", "Kho B", "Kho C"]}
                radius={4}
              />
              <TextInput
                label="Vị trí"
                value={draft.location}
                onChange={(e) =>
                  setDraft({ ...draft, location: e.currentTarget.value })
                }
                radius={4}
              />
            </SimpleGrid>
            <Switch
              label="Theo dõi lô"
              checked={draft.lotTracking}
              onChange={(e) =>
                setDraft({ ...draft, lotTracking: e.currentTarget.checked })
              }
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

        {modalType === "compliance" && (
          <Stack>
            <MultiSelect
              label="Tiêu chuẩn"
              value={draft.standards}
              onChange={(v) => setDraft({ ...draft, standards: v })}
              data={["EN 374", "EN 388", "EN 455", "ISO 13485"]}
              searchable
              clearable
              radius={4}
            />
            <SimpleGrid cols={2}>
              <Select
                label="PPE Category"
                value={draft.ppeCategory}
                onChange={(v) => setDraft({ ...draft, ppeCategory: v })}
                data={["Cat I", "Cat II", "Cat III"]}
                radius={4}
              />
              <Select
                label="Quốc gia sản xuất"
                value={draft.countryOfOrigin}
                onChange={(v) => setDraft({ ...draft, countryOfOrigin: v })}
                data={["Vietnam", "Malaysia", "Thailand", "China"]}
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <Switch
                label="Food safe"
                checked={draft.foodSafe}
                onChange={(e) =>
                  setDraft({ ...draft, foodSafe: e.currentTarget.checked })
                }
              />
              <Switch
                label="MSDS"
                checked={draft.msds}
                onChange={(e) =>
                  setDraft({ ...draft, msds: e.currentTarget.checked })
                }
              />
              <Switch
                label="COA"
                checked={draft.coa}
                onChange={(e) =>
                  setDraft({ ...draft, coa: e.currentTarget.checked })
                }
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput
                label="Phân loại nguy hại"
                value={draft.hazardClass}
                onChange={(e) =>
                  setDraft({ ...draft, hazardClass: e.currentTarget.value })
                }
                radius={4}
              />
              <NumberInput
                label="Hạn dùng (tháng)"
                value={draft.shelfLifeMonths}
                onChange={(v) =>
                  setDraft({ ...draft, shelfLifeMonths: Number(v) })
                }
                min={0}
                radius={4}
              />
            </SimpleGrid>
            <DatePickerInput
              label="Kiểm định gần nhất"
              value={draft.lastInspection}
              onChange={(v) => setDraft({ ...draft, lastInspection: v })}
              radius={4}
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

        {modalType === "lots" && (
          <Stack>
            <Stack gap="xs">
              {(draft.lots ?? []).map((l: Lot, idx: number) => (
                <Card key={idx} withBorder radius={4} p="sm">
                  <Group align="end">
                    <TextInput
                      label="Mã lô"
                      value={l.lot}
                      onChange={(e) => {
                        const lots = [...draft.lots];
                        lots[idx] = {
                          ...lots[idx],
                          lot: e.currentTarget.value,
                        };
                        setDraft({ ...draft, lots });
                      }}
                      radius={4}
                    />
                    <NumberInput
                      label="SL"
                      value={l.qty}
                      onChange={(v) => {
                        const lots = [...draft.lots];
                        lots[idx] = { ...lots[idx], qty: Number(v) || 0 };
                        setDraft({ ...draft, lots });
                      }}
                      min={0}
                      radius={4}
                    />
                    <TextInput
                      label="Vị trí"
                      value={l.location || ""}
                      onChange={(e) => {
                        const lots = [...draft.lots];
                        lots[idx] = {
                          ...lots[idx],
                          location: e.currentTarget.value,
                        };
                        setDraft({ ...draft, lots });
                      }}
                      radius={4}
                    />
                  </Group>
                  <Group mt="xs">
                    <DatePickerInput
                      label="Ngày SX"
                      value={l.mfgDate}
                      onChange={(v) => {
                        const lots = [...draft.lots];
                        lots[idx] = { ...lots[idx], mfgDate: v };
                        setDraft({ ...draft, lots });
                      }}
                      radius={4}
                    />
                    <DatePickerInput
                      label="HSD"
                      value={l.expDate}
                      onChange={(v) => {
                        const lots = [...draft.lots];
                        lots[idx] = { ...lots[idx], expDate: v };
                        setDraft({ ...draft, lots });
                      }}
                      radius={4}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      radius={4}
                      mt={22}
                      onClick={() => {
                        const lots = [...draft.lots];
                        lots.splice(idx, 1);
                        setDraft({ ...draft, lots });
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                radius={4}
                onClick={() =>
                  setDraft({
                    ...draft,
                    lots: [...(draft.lots ?? []), { lot: "", qty: 0 }],
                  })
                }
              >
                Thêm lô
              </Button>
            </Stack>
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
      </Modal>
    </>
  );
}
