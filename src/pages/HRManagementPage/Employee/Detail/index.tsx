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
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type BankAccount = {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branch?: string;
  note?: string;
};

type Employee = {
  avatarUrl: string;
  employeeCode: string;
  fullName: string;
  gender: "male" | "female" | "other";
  dob: Date | null;
  phone: string;
  email: string;
  nationalId: string;
  taxCode: string;
  address: {
    city: string;
    district: string;
    ward: string;
    street: string;
  };
  employment: {
    position: string;
    employeeType: "fulltime" | "parttime" | "contract";
    startDate: Date | null;
    contractMonths: number;
    manager: string;
  };
  organization: {
    departments: string[];
    teams: string[];
  };
  payroll: {
    salary: number;
    allowances: number;
    overtimeRate: number;
    currency: "VND" | "USD";
    bankAccounts: BankAccount[];
  };
  emergency: {
    name: string;
    relation: string;
    phone: string;
  };
  skills: string[];
  certifications: string[];
  notes: string;
  active: boolean;
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

const bankOptions = [
  "Vietcombank (VCB)",
  "Techcombank (TCB)",
  "VietinBank (CTG)",
  "BIDV (BID)",
  "ACB",
];

const cityOptions = ["TP.HCM", "Hà Nội", "Đà Nẵng"];
const districtOptions = ["Quận 1", "Quận 7", "Thủ Đức", "Cầu Giấy", "Hải Châu"];
const wardOptions = ["Phường 1", "Phường 2", "Phường 3", "Tân Phú"];
const departmentOptions = [
  "Ban kĩ thuật",
  "Ban tài chính",
  "Ban kế hoạch",
  "Nhân sự",
];
const teamOptions = ["Đội A01", "Đội B02", "Đội C03"];
const skillOptions = [
  "Excel",
  "Tiếng Anh",
  "An toàn lao động",
  "Kế hoạch sản xuất",
  "Vận hành thiết bị",
];

export default function HRManagementEmployeeDetailPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Employee>({
    avatarUrl:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1200&auto=format&fit=crop",
    employeeCode: "EMP-00089",
    fullName: "Nguyễn Văn A",
    gender: "male",
    dob: new Date("1995-05-16"),
    phone: "0901234567",
    email: "nguyenvana@mvg.vn",
    nationalId: "079123456789",
    taxCode: "0312345678",
    address: {
      city: "TP.HCM",
      district: "Quận 7",
      ward: "Tân Phú",
      street: "123 Đường ABC",
    },
    employment: {
      position: "Kỹ sư hiện trường",
      employeeType: "fulltime",
      startDate: new Date("2023-03-01"),
      contractMonths: 24,
      manager: "Trần B",
    },
    organization: { departments: ["Ban kĩ thuật"], teams: ["Đội A01"] },
    payroll: {
      salary: 18000000,
      allowances: 2000000,
      overtimeRate: 150,
      currency: "VND",
      bankAccounts: [
        {
          bankName: "Techcombank (TCB)",
          accountHolder: "Nguyễn Văn A",
          accountNumber: "190012345678",
          branch: "Sài Gòn",
        },
      ],
    },
    emergency: {
      name: "Nguyễn Thị C",
      relation: "Vợ/Chồng",
      phone: "0908765432",
    },
    skills: ["Excel", "An toàn lao động"],
    certifications: ["Chứng chỉ ATLĐ cơ bản", "Đào tạo sơ cứu 2024"],
    notes: "Ưu tiên ca sáng, sẵn sàng đi công tác 3–5 ngày.",
    active: true,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [modal, setModal] = useState<
    | "avatar"
    | "basic"
    | "address"
    | "employment"
    | "org"
    | "payroll"
    | "banks"
    | "skills"
    | "emergency"
    | "notes"
    | null
  >(null);
  const [draft, setDraft] = useState<any>({});

  const formatMoney = (n: number, cur: "VND" | "USD" = data.payroll.currency) =>
    (n ?? 0).toLocaleString("vi-VN") + (cur === "VND" ? " ₫" : " $");
  const age = useMemo(() => {
    if (!data.dob) return "—";
    const diff = Date.now() - data.dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  }, [data.dob]);

  const openModal = (m: NonNullable<typeof modal>) => {
    if (m === "avatar") setDraft({ avatarUrl: data.avatarUrl });
    if (m === "basic")
      setDraft({
        fullName: data.fullName,
        employeeCode: data.employeeCode,
        gender: data.gender,
        dob: data.dob,
        phone: data.phone,
        email: data.email,
        nationalId: data.nationalId,
        taxCode: data.taxCode,
        active: data.active,
      });
    if (m === "address") setDraft({ ...data.address });
    if (m === "employment") setDraft({ ...data.employment });
    if (m === "org")
      setDraft({
        departments: [...data.organization.departments],
        teams: [...data.organization.teams],
      });
    if (m === "payroll") setDraft({ ...data.payroll });
    if (m === "banks")
      setDraft({
        bankAccounts: data.payroll.bankAccounts.map((b) => ({ ...b })),
      });
    if (m === "skills")
      setDraft({
        skills: [...data.skills],
        certifications: [...data.certifications],
      });
    if (m === "emergency") setDraft({ ...data.emergency });
    if (m === "notes") setDraft({ notes: data.notes });
    setModal(m);
    open();
  };

  const applyModal = () => {
    if (modal === "avatar")
      setData((s) => ({ ...s, avatarUrl: draft.avatarUrl }));
    if (modal === "basic")
      setData((s) => ({
        ...s,
        fullName: draft.fullName,
        employeeCode: draft.employeeCode,
        gender: draft.gender,
        dob: draft.dob,
        phone: draft.phone,
        email: draft.email,
        nationalId: draft.nationalId,
        taxCode: draft.taxCode,
        active: !!draft.active,
      }));
    if (modal === "address") setData((s) => ({ ...s, address: { ...draft } }));
    if (modal === "employment")
      setData((s) => ({ ...s, employment: { ...draft } }));
    if (modal === "org")
      setData((s) => ({
        ...s,
        organization: {
          departments: draft.departments ?? [],
          teams: draft.teams ?? [],
        },
      }));
    if (modal === "payroll")
      setData((s) => ({
        ...s,
        payroll: {
          salary: Number(draft.salary) || 0,
          allowances: Number(draft.allowances) || 0,
          overtimeRate: Number(draft.overtimeRate) || 100,
          currency: draft.currency,
          bankAccounts: s.payroll.bankAccounts,
        },
      }));
    if (modal === "banks")
      setData((s) => ({
        ...s,
        payroll: { ...s.payroll, bankAccounts: draft.bankAccounts ?? [] },
      }));
    if (modal === "skills")
      setData((s) => ({
        ...s,
        skills: draft.skills ?? [],
        certifications: draft.certifications ?? [],
      }));
    if (modal === "emergency")
      setData((s) => ({ ...s, emergency: { ...draft } }));
    if (modal === "notes") setData((s) => ({ ...s, notes: draft.notes ?? "" }));
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
              <Title order={3}>Chi tiết nhân sự</Title>
              <Group gap={8} wrap="wrap">
                <Badge variant="light">{data.employment.position}</Badge>
                <Badge>
                  {data.employment.employeeType === "fulltime"
                    ? "Toàn thời gian"
                    : "Khác"}
                </Badge>
                {data.organization.departments.map((d) => (
                  <Badge key={d} variant="dot">
                    {d}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Group>
          <Group>
            <Button
              variant="default"
              radius={4}
              onClick={() => openModal("notes")}
            >
              Ghi chú
            </Button>
            <Button radius={4}>Cập nhật</Button>
          </Group>
        </Group>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack>
              <Section
                title="Thông tin cơ bản"
                right={
                  <Group gap={6}>
                    <Button
                      variant="light"
                      radius={4}
                      onClick={() => openModal("avatar")}
                    >
                      Ảnh
                    </Button>
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => openModal("basic")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Group>
                }
              >
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <Card withBorder radius={4} p="xs">
                      <Image
                        src={data.avatarUrl}
                        radius={4}
                        h={210}
                        fit="cover"
                      />
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 8 }}>
                    <SimpleGrid cols={2} spacing="sm">
                      <FieldRow label="Mã NV" value={data.employeeCode} />
                      <FieldRow label="Họ tên" value={data.fullName} />
                      <FieldRow
                        label="Giới tính"
                        value={
                          data.gender === "male"
                            ? "Nam"
                            : data.gender === "female"
                            ? "Nữ"
                            : "Khác"
                        }
                      />
                      <FieldRow label="Tuổi" value={age} />
                      <FieldRow
                        label="Ngày sinh"
                        value={
                          data.dob ? data.dob.toLocaleDateString("vi-VN") : "—"
                        }
                      />
                      <FieldRow
                        label="Trạng thái"
                        value={data.active ? "Đang làm việc" : "Nghỉ"}
                      />
                    </SimpleGrid>
                    <Divider my="sm" />
                    <SimpleGrid cols={2} spacing="sm">
                      <FieldRow label="Điện thoại" value={data.phone} />
                      <FieldRow label="Email" value={data.email} />
                      <FieldRow label="CMND/CCCD" value={data.nationalId} />
                      <FieldRow label="Mã số thuế" value={data.taxCode} />
                    </SimpleGrid>
                  </Grid.Col>
                </Grid>
              </Section>

              <Section
                title="Địa chỉ liên hệ"
                right={
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => openModal("address")}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                }
              >
                <SimpleGrid cols={2}>
                  <FieldRow label="Tỉnh/Thành" value={data.address.city} />
                  <FieldRow label="Quận/Huyện" value={data.address.district} />
                  <FieldRow label="Phường/Xã" value={data.address.ward} />
                  <FieldRow label="Đường/Số nhà" value={data.address.street} />
                </SimpleGrid>
              </Section>

              <Section
                title="Tổ chức & Phòng ban"
                right={
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => openModal("org")}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                }
              >
                <Stack gap={6}>
                  <Text size="sm" c="dimmed">
                    Phòng ban
                  </Text>
                  <Group gap={6} wrap="wrap">
                    {data.organization.departments.map((d) => (
                      <Badge key={d} variant="light" color="teal">
                        {d}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
                <Stack gap={6} mt="sm">
                  <Text size="sm" c="dimmed">
                    Đội nhóm
                  </Text>
                  <Group gap={6} wrap="wrap">
                    {data.organization.teams.map((t) => (
                      <Badge key={t} variant="dot" color="indigo">
                        {t}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Section>

              <Section
                title="Kỹ năng & Chứng chỉ"
                right={
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => openModal("skills")}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                }
              >
                <Stack gap={6}>
                  <Text size="sm" c="dimmed">
                    Kỹ năng
                  </Text>
                  <Group gap={6} wrap="wrap">
                    {data.skills.map((s) => (
                      <Badge key={s} variant="light" color="grape">
                        {s}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
                <Stack gap={6} mt="sm">
                  <Text size="sm" c="dimmed">
                    Chứng chỉ
                  </Text>
                  <Group gap={6} wrap="wrap">
                    {data.certifications.map((c) => (
                      <Badge key={c} variant="dot" color="orange">
                        {c}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Section>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack>
              <Section
                title="Thông tin công việc"
                right={
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => openModal("employment")}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                }
              >
                <SimpleGrid cols={2} spacing="sm">
                  <FieldRow
                    label="Chức danh"
                    value={data.employment.position}
                  />
                  <FieldRow
                    label="Loại HĐ"
                    value={
                      data.employment.employeeType === "fulltime"
                        ? "Toàn thời gian"
                        : data.employment.employeeType === "parttime"
                        ? "Bán thời gian"
                        : "Thời vụ"
                    }
                  />
                  <FieldRow
                    label="Ngày bắt đầu"
                    value={data.employment.startDate?.toLocaleDateString(
                      "vi-VN"
                    )}
                  />
                  <FieldRow
                    label="Thời hạn HĐ"
                    value={`${data.employment.contractMonths} tháng`}
                  />
                  <FieldRow
                    label="Quản lý trực tiếp"
                    value={data.employment.manager}
                  />
                </SimpleGrid>
              </Section>

              <Section
                title="Lương & Phụ cấp"
                right={
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => openModal("payroll")}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                }
              >
                <SimpleGrid cols={2} spacing="sm">
                  <FieldRow
                    label="Lương cơ bản"
                    value={formatMoney(data.payroll.salary)}
                  />
                  <FieldRow
                    label="Phụ cấp"
                    value={formatMoney(data.payroll.allowances)}
                  />
                  <FieldRow
                    label="Tăng ca"
                    value={`${data.payroll.overtimeRate}%`}
                  />
                  <FieldRow label="Tiền tệ" value={data.payroll.currency} />
                </SimpleGrid>
              </Section>

              <Section
                title="Tài khoản ngân hàng"
                right={
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => openModal("banks")}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                }
              >
                <Stack gap="xs">
                  {data.payroll.bankAccounts.map((b, idx) => (
                    <Card key={idx} withBorder radius={4} p="sm">
                      <Group justify="space-between" align="flex-start">
                        <Stack gap={2}>
                          <Text fw={600} size="sm">
                            {b.bankName}
                          </Text>
                          <Text size="sm" c="dimmed">
                            Chủ TK: {b.accountHolder}
                          </Text>
                          <Text size="sm">STK: {b.accountNumber}</Text>
                          {b.branch && (
                            <Text size="sm">Chi nhánh: {b.branch}</Text>
                          )}
                          {b.note && (
                            <Text size="sm" c="dimmed">
                              {b.note}
                            </Text>
                          )}
                        </Stack>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Section>

              <Section
                title="Liên hệ khẩn cấp"
                right={
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => openModal("emergency")}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                }
              >
                <SimpleGrid cols={2} spacing="sm">
                  <FieldRow label="Họ tên" value={data.emergency.name} />
                  <FieldRow label="Quan hệ" value={data.emergency.relation} />
                  <FieldRow label="Điện thoại" value={data.emergency.phone} />
                </SimpleGrid>
              </Section>
            </Stack>
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
        {modal === "avatar" && (
          <Stack>
            <Input.Wrapper label="Ảnh đại diện">
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={(files) =>
                  setDraft({
                    ...draft,
                    avatarUrl: URL.createObjectURL(files[0]),
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
                src={draft.avatarUrl || data.avatarUrl}
                radius={4}
                h={220}
                fit="cover"
              />
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

        {modal === "basic" && (
          <Stack>
            <SimpleGrid cols={3}>
              <TextInput
                label="Mã NV"
                value={draft.employeeCode}
                onChange={(e) =>
                  setDraft({ ...draft, employeeCode: e.currentTarget.value })
                }
                radius={4}
              />
              <TextInput
                label="Họ tên"
                value={draft.fullName}
                onChange={(e) =>
                  setDraft({ ...draft, fullName: e.currentTarget.value })
                }
                radius={4}
              />
              <Select
                label="Giới tính"
                value={draft.gender}
                onChange={(v) => setDraft({ ...draft, gender: v })}
                data={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                  { value: "other", label: "Khác" },
                ]}
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <DatePickerInput
                label="Ngày sinh"
                value={draft.dob}
                onChange={(v) => setDraft({ ...draft, dob: v })}
                radius={4}
              />
              <TextInput
                label="Điện thoại"
                value={draft.phone}
                onChange={(e) =>
                  setDraft({ ...draft, phone: e.currentTarget.value })
                }
                radius={4}
              />
              <TextInput
                label="Email"
                value={draft.email}
                onChange={(e) =>
                  setDraft({ ...draft, email: e.currentTarget.value })
                }
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <TextInput
                label="CMND/CCCD"
                value={draft.nationalId}
                onChange={(e) =>
                  setDraft({ ...draft, nationalId: e.currentTarget.value })
                }
                radius={4}
              />
              <TextInput
                label="Mã số thuế"
                value={draft.taxCode}
                onChange={(e) =>
                  setDraft({ ...draft, taxCode: e.currentTarget.value })
                }
                radius={4}
              />
              <Switch
                mt={24}
                label="Đang làm việc"
                checked={draft.active}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.currentTarget.checked })
                }
              />
            </SimpleGrid>
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

        {modal === "address" && (
          <Stack>
            <SimpleGrid cols={2}>
              <Select
                label="Tỉnh/Thành"
                value={draft.city}
                onChange={(v) => setDraft({ ...draft, city: v })}
                data={cityOptions}
                searchable
                clearable
                radius={4}
              />
              <Select
                label="Quận/Huyện"
                value={draft.district}
                onChange={(v) => setDraft({ ...draft, district: v })}
                data={districtOptions}
                searchable
                clearable
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <Select
                label="Phường/Xã"
                value={draft.ward}
                onChange={(v) => setDraft({ ...draft, ward: v })}
                data={wardOptions}
                searchable
                clearable
                radius={4}
              />
              <TextInput
                label="Đường/Số nhà"
                value={draft.street}
                onChange={(e) =>
                  setDraft({ ...draft, street: e.currentTarget.value })
                }
                radius={4}
              />
            </SimpleGrid>
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

        {modal === "employment" && (
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput
                label="Chức danh"
                value={draft.position}
                onChange={(e) =>
                  setDraft({ ...draft, position: e.currentTarget.value })
                }
                radius={4}
              />
              <Select
                label="Loại HĐ"
                value={draft.employeeType}
                onChange={(v) => setDraft({ ...draft, employeeType: v })}
                data={[
                  { value: "fulltime", label: "Toàn thời gian" },
                  { value: "parttime", label: "Bán thời gian" },
                  { value: "contract", label: "Thời vụ/Hợp đồng" },
                ]}
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <DatePickerInput
                label="Ngày bắt đầu"
                value={draft.startDate}
                onChange={(v) => setDraft({ ...draft, startDate: v })}
                radius={4}
              />
              <NumberInput
                label="Thời hạn (tháng)"
                value={draft.contractMonths}
                onChange={(v) =>
                  setDraft({ ...draft, contractMonths: Number(v) })
                }
                min={0}
                radius={4}
              />
              <TextInput
                label="Quản lý trực tiếp"
                value={draft.manager}
                onChange={(e) =>
                  setDraft({ ...draft, manager: e.currentTarget.value })
                }
                radius={4}
              />
            </SimpleGrid>
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

        {modal === "org" && (
          <Stack>
            <MultiSelect
              label="Phòng ban"
              value={draft.departments}
              onChange={(v) => setDraft({ ...draft, departments: v })}
              data={departmentOptions}
              searchable
              clearable
              radius={4}
            />
            <MultiSelect
              label="Đội nhóm"
              value={draft.teams}
              onChange={(v) => setDraft({ ...draft, teams: v })}
              data={teamOptions}
              searchable
              clearable
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

        {modal === "payroll" && (
          <Stack>
            <SimpleGrid cols={2}>
              <NumberInput
                label="Lương cơ bản"
                value={draft.salary}
                onChange={(v) => setDraft({ ...draft, salary: Number(v) })}
                min={0}
                thousandSeparator=","
                radius={4}
              />
              <NumberInput
                label="Phụ cấp"
                value={draft.allowances}
                onChange={(v) => setDraft({ ...draft, allowances: Number(v) })}
                min={0}
                thousandSeparator=","
                radius={4}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <NumberInput
                label="Tăng ca (%)"
                value={draft.overtimeRate}
                onChange={(v) =>
                  setDraft({ ...draft, overtimeRate: Number(v) })
                }
                min={100}
                max={300}
                step={10}
                radius={4}
              />
              <Select
                label="Tiền tệ"
                value={draft.currency}
                onChange={(v) => setDraft({ ...draft, currency: v })}
                data={["VND", "USD"]}
                radius={4}
              />
            </SimpleGrid>
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

        {modal === "banks" && (
          <Stack>
            <Stack gap="xs">
              {(draft.bankAccounts ?? []).map((b: BankAccount, idx: number) => (
                <Card key={idx} withBorder radius={4} p="sm">
                  <Group align="end">
                    <Select
                      label="Ngân hàng"
                      data={bankOptions}
                      value={b.bankName}
                      onChange={(v) => {
                        const arr = [...draft.bankAccounts];
                        arr[idx] = { ...arr[idx], bankName: v as string };
                        setDraft({ ...draft, bankAccounts: arr });
                      }}
                      searchable
                      radius={4}
                    />
                    <TextInput
                      label="Chủ TK"
                      value={b.accountHolder}
                      onChange={(e) => {
                        const arr = [...draft.bankAccounts];
                        arr[idx] = {
                          ...arr[idx],
                          accountHolder: e.currentTarget.value,
                        };
                        setDraft({ ...draft, bankAccounts: arr });
                      }}
                      radius={4}
                    />
                    <TextInput
                      label="Số TK"
                      value={b.accountNumber}
                      onChange={(e) => {
                        const arr = [...draft.bankAccounts];
                        arr[idx] = {
                          ...arr[idx],
                          accountNumber: e.currentTarget.value,
                        };
                        setDraft({ ...draft, bankAccounts: arr });
                      }}
                      radius={4}
                    />
                    <TextInput
                      label="Chi nhánh"
                      value={b.branch || ""}
                      onChange={(e) => {
                        const arr = [...draft.bankAccounts];
                        arr[idx] = {
                          ...arr[idx],
                          branch: e.currentTarget.value,
                        };
                        setDraft({ ...draft, bankAccounts: arr });
                      }}
                      radius={4}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      radius={4}
                      onClick={() => {
                        const arr = [...draft.bankAccounts];
                        arr.splice(idx, 1);
                        setDraft({ ...draft, bankAccounts: arr });
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
                    bankAccounts: [
                      ...(draft.bankAccounts ?? []),
                      {
                        bankName: "",
                        accountHolder: "",
                        accountNumber: "",
                        branch: "",
                      },
                    ],
                  })
                }
              >
                Thêm tài khoản
              </Button>
            </Stack>
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

        {modal === "skills" && (
          <Stack>
            <MultiSelect
              label="Kỹ năng"
              value={draft.skills}
              onChange={(v) => setDraft({ ...draft, skills: v })}
              data={skillOptions}
              searchable
              clearable
              radius={4}
            />
            <MultiSelect
              label="Chứng chỉ"
              value={draft.certifications}
              onChange={(v) => setDraft({ ...draft, certifications: v })}
              data={[
                "ATLĐ cơ bản",
                "Sơ cứu 2024",
                "ISO 9001 Awareness",
                "PCCC cơ bản",
              ]}
              searchable
              clearable
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

        {modal === "emergency" && (
          <Stack>
            <SimpleGrid cols={3}>
              <TextInput
                label="Họ tên"
                value={draft.name}
                onChange={(e) =>
                  setDraft({ ...draft, name: e.currentTarget.value })
                }
                radius={4}
              />
              <TextInput
                label="Quan hệ"
                value={draft.relation}
                onChange={(e) =>
                  setDraft({ ...draft, relation: e.currentTarget.value })
                }
                radius={4}
              />
              <TextInput
                label="Điện thoại"
                value={draft.phone}
                onChange={(e) =>
                  setDraft({ ...draft, phone: e.currentTarget.value })
                }
                radius={4}
              />
            </SimpleGrid>
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

        {modal === "notes" && (
          <Stack>
            <Textarea
              label="Ghi chú"
              minRows={4}
              value={draft.notes ?? data.notes}
              onChange={(e) =>
                setDraft({ ...draft, notes: e.currentTarget.value })
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
      </Modal>
    </>
  );
}
