import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
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
  IconUserPlus,
  IconUsers,
  IconShieldCheck,
  IconTrash,
  IconSearch,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeCardList } from "../Add/components/EmployeeCardList";

type RoleKey = "leader" | "member" | "viewer";
type PermissionKey = "view" | "edit" | "manage";

type TeamRole = {
  key: RoleKey | string;
  label: string;
  permissions: Record<PermissionKey, boolean>;
  memberCount?: number;
};

type TeamMember = {
  id: string;
  fullName: string;
  username: string;
  department: string;
  role: string;
  status: "Đang hoạt động" | "Thử việc" | "Nghỉ";
};

type Team = {
  code: string;
  name: string;
  description?: string;
  departments: string[];
  roles: TeamRole[];
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

const ALL_DEPARTMENTS = [
  "Phòng Kỹ Thuật",
  "Phòng Vận Hành",
  "Phòng Kế Hoạch",
  "Phòng Tài Chính",
  "Phòng Vật Tư",
  "Phòng Nghiên Cứu",
];

const ALL_EMPLOYEES: TeamMember[] = [
  {
    id: "EMP001",
    fullName: "Nguyễn Văn A",
    username: "nguyenvana",
    department: "Phòng Kỹ Thuật",
    role: "Kỹ sư canh tác",
    status: "Đang hoạt động",
  },
  {
    id: "EMP002",
    fullName: "Trần Thị B",
    username: "tranthib",
    department: "Phòng Vận Hành",
    role: "Nhân viên kỹ thuật",
    status: "Thử việc",
  },
  {
    id: "EMP003",
    fullName: "Lê Văn C",
    username: "levanc",
    department: "Phòng Kế Hoạch",
    role: "Chuyên viên kế hoạch",
    status: "Đang hoạt động",
  },
  {
    id: "EMP004",
    fullName: "Phạm Thị D",
    username: "phamthid",
    department: "Phòng Tài Chính",
    role: "Kế toán viên",
    status: "Đang hoạt động",
  },
  {
    id: "EMP005",
    fullName: "Nguyễn Văn E",
    username: "nguyenvane",
    department: "Phòng Vật Tư",
    role: "Nhân viên kho",
    status: "Đang hoạt động",
  },
  {
    id: "EMP006",
    fullName: "Trần Văn F",
    username: "tranvanf",
    department: "Phòng Nghiên Cứu",
    role: "Trưởng nhóm nghiên cứu",
    status: "Đang hoạt động",
  },
];

const STATUS_COLOR: Record<TeamMember["status"], string> = {
  "Đang hoạt động": "green",
  "Thử việc": "yellow",
  Nghỉ: "gray",
};

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

export default function HRManagementTeamDetailPage() {
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team>({
    code: "TEAM-GSSX",
    name: "Nhóm Giám Sát Sản Xuất",
    description:
      "Giám sát tiến độ & chất lượng vùng trồng A/B. Phối hợp kế hoạch – vật tư – vận hành.",
    departments: ["Phòng Kỹ Thuật", "Phòng Vận Hành"],
    roles: [
      {
        key: "leader",
        label: "Trưởng nhóm",
        permissions: { view: true, edit: true, manage: true },
        memberCount: 1,
      },
      {
        key: "member",
        label: "Thành viên",
        permissions: { view: true, edit: true, manage: false },
        memberCount: 4,
      },
      {
        key: "viewer",
        label: "Người xem",
        permissions: { view: true, edit: false, manage: false },
        memberCount: 2,
      },
    ],
    members: [
      ALL_EMPLOYEES[0],
      ALL_EMPLOYEES[1],
      ALL_EMPLOYEES[2],
      ALL_EMPLOYEES[3],
      ALL_EMPLOYEES[4],
      ALL_EMPLOYEES[5],
    ],
    createdAt: "2025-06-12",
    updatedAt: "2025-08-20",
    active: true,
  });

  const totalActive = useMemo(
    () => team.members.filter((m) => m.status === "Đang hoạt động").length,
    [team.members]
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [which, setWhich] = useState<
    "basic" | "departments" | "members" | "roles" | "archive" | null
  >(null);
  const [draft, setDraft] = useState<any>({});

  const openModal = (key: NonNullable<typeof which>) => {
    if (key === "basic")
      setDraft({
        name: team.name,
        code: team.code,
        description: team.description,
      });
    if (key === "departments") setDraft({ departments: [...team.departments] });
    if (key === "members")
      setDraft({ memberIds: team.members.map((m) => m.id), filterDept: "" });
    if (key === "roles")
      setDraft({
        roles: team.roles.map((r) => ({
          key: r.key,
          label: r.label,
          permissions: { ...r.permissions },
          memberCount: r.memberCount ?? 0,
        })),
        newRoleLabel: "",
      });
    if (key === "archive") setDraft({ active: team.active, archiveNote: "" });
    setWhich(key);
    open();
  };

  const applyModal = () => {
    if (which === "basic") {
      setTeam((s) => ({
        ...s,
        name: draft.name?.trim() || s.name,
        code: draft.code?.trim() || s.code,
        description: draft.description || "",
        updatedAt: new Date().toISOString().slice(0, 10),
      }));
    }
    if (which === "departments") {
      setTeam((s) => ({
        ...s,
        departments: draft.departments ?? [],
        updatedAt: new Date().toISOString().slice(0, 10),
      }));
    }
    if (which === "members") {
      const selected = ALL_EMPLOYEES.filter((e) =>
        (draft.memberIds ?? []).includes(e.id)
      );
      setTeam((s) => ({
        ...s,
        members: selected,
        updatedAt: new Date().toISOString().slice(0, 10),
      }));
    }
    if (which === "roles") {
      setTeam((s) => ({
        ...s,
        roles: draft.roles ?? s.roles,
        updatedAt: new Date().toISOString().slice(0, 10),
      }));
    }
    if (which === "archive") {
      setTeam((s) => ({
        ...s,
        active: !!draft.active,
        updatedAt: new Date().toISOString().slice(0, 10),
      }));
    }
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
              <Title order={3}>Chi tiết Nhóm</Title>
              <Group gap={8} wrap="wrap">
                <Badge variant="light" color={team.active ? "green" : "gray"}>
                  {team.active ? "Đang hoạt động" : "Đã lưu trữ"}
                </Badge>
                <Badge variant="dot">{team.code}</Badge>
                <Badge color="teal" variant="light">
                  {totalActive}/{team.members.length} thành viên hoạt động
                </Badge>
              </Group>
            </Stack>
          </Group>
          <Group>
            <Button
              radius={4}
              variant="default"
              onClick={() => openModal("archive")}
            >
              Trạng thái
            </Button>
            <Button radius={4} onClick={() => openModal("basic")}>
              Chỉnh sửa
            </Button>
          </Group>
        </Group>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack>
              <Section
                title="Tổng quan nhóm"
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
                <SimpleGrid cols={2} spacing="sm">
                  <FieldRow label="Tên nhóm" value={team.name} />
                  <FieldRow label="Mã nhóm" value={team.code} />
                </SimpleGrid>
                <Divider my="sm" />
                <Text size="sm">{team.description}</Text>
                <Divider my="sm" />
                <SimpleGrid cols={2} spacing="sm">
                  <FieldRow label="Ngày tạo" value={team.createdAt} />
                  <FieldRow label="Cập nhật" value={team.updatedAt} />
                </SimpleGrid>
              </Section>

              <Section
                title="Phòng ban liên quan"
                right={
                  <ActionIcon
                    variant="light"
                    radius={4}
                    onClick={() => openModal("departments")}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                }
              >
                <Group gap={8} wrap="wrap">
                  {team.departments.map((d) => (
                    <Badge key={d} variant="light" color="indigo">
                      {d}
                    </Badge>
                  ))}
                </Group>
              </Section>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Section
              title="Thành viên"
              right={
                <Group gap={6}>
                  <Button
                    radius={4}
                    size="xs"
                    leftSection={<IconUserPlus size={14} />}
                    onClick={() => openModal("members")}
                  >
                    Quản lý thành viên
                  </Button>
                </Group>
              }
            >
              <ScrollArea h={360} type="auto">
                <Stack gap="sm">
                  {team.members.map((m) => (
                    <Card key={m.id} withBorder radius={4} p="sm">
                      <Group align="center" justify="space-between">
                        <Group>
                          <Avatar radius={4} color="blue">
                            {m.fullName.split(" ").slice(-1)[0]?.[0] || "U"}
                          </Avatar>
                          <Stack gap={2}>
                            <Text fw={600} size="sm">
                              {m.fullName}
                            </Text>
                            <Group gap={8}>
                              <Badge variant="dot">{m.username}</Badge>
                              <Badge variant="light" color="gray">
                                {m.department}
                              </Badge>
                              <Badge variant="light" color="violet">
                                {m.role}
                              </Badge>
                              <Badge color={STATUS_COLOR[m.status]}>
                                {m.status}
                              </Badge>
                            </Group>
                          </Stack>
                        </Group>
                        <ActionIcon
                          variant="light"
                          color="red"
                          radius={4}
                          onClick={() =>
                            setTeam((s) => ({
                              ...s,
                              members: s.members.filter((x) => x.id !== m.id),
                            }))
                          }
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </ScrollArea>
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
        {which === "basic" && (
          <Stack>
            <TextInput
              label="Tên nhóm"
              value={draft.name}
              onChange={(e) =>
                setDraft({ ...draft, name: e.currentTarget.value })
              }
              radius={4}
            />
            <TextInput
              label="Mã nhóm"
              value={draft.code}
              onChange={(e) =>
                setDraft({ ...draft, code: e.currentTarget.value })
              }
              radius={4}
            />
            <Textarea
              label="Mô tả"
              minRows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.currentTarget.value })
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

        {which === "departments" && (
          <Stack>
            <MultiSelect
              label="Phòng ban liên quan"
              searchable
              clearable
              data={ALL_DEPARTMENTS}
              value={draft.departments}
              onChange={(v) => setDraft({ ...draft, departments: v })}
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

        {which === "members" && (
          <Stack>
            <Group grow>
              <Select
                label="Lọc theo phòng ban"
                placeholder="Tất cả"
                data={["", ...ALL_DEPARTMENTS].map((d) => ({
                  value: d,
                  label: d || "Tất cả",
                }))}
                value={draft.filterDept}
                onChange={(v) => setDraft({ ...draft, filterDept: v })}
                radius={4}
              />
              <Select
                label="Chọn nhanh vai trò"
                placeholder="(Không gán)"
                data={[
                  { value: "leader", label: "Trưởng nhóm" },
                  { value: "member", label: "Thành viên" },
                  { value: "viewer", label: "Người xem" },
                ]}
                radius={4}
              />
            </Group>
            <TextInput
              label="Nhân viên"
              placeholder="Chọn thành viên từ nhân sự"
              leftSection={<IconSearch size={16} />}
              radius={4}
            />
            <EmployeeCardList />
            <Group justify="flex-end">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button
                radius={4}
                leftSection={<IconPlus size={16} />}
                onClick={applyModal}
              >
                Áp dụng
              </Button>
            </Group>
          </Stack>
        )}

        {which === "roles" && (
          <Stack>
            <ScrollArea h={260} type="auto">
              <Stack>
                {(draft.roles as TeamRole[]).map((r: TeamRole, idx: number) => (
                  <Card key={r.key + idx} withBorder radius={4} p="sm">
                    <Group justify="space-between" align="center">
                      <Group>
                        <IconShieldCheck size={16} />
                        <TextInput
                          value={r.label}
                          onChange={(e) => {
                            const arr = [...draft.roles];
                            arr[idx] = {
                              ...arr[idx],
                              label: e.currentTarget.value,
                            };
                            setDraft({ ...draft, roles: arr });
                          }}
                          radius={4}
                        />
                        <NumberInput
                          label="Số TV"
                          value={r.memberCount ?? 0}
                          onChange={(v) => {
                            const arr = [...draft.roles];
                            arr[idx] = { ...arr[idx], memberCount: Number(v) };
                            setDraft({ ...draft, roles: arr });
                          }}
                          w={110}
                          radius={4}
                        />
                      </Group>
                      <Group gap={16}>
                        <Checkbox
                          label="Xem"
                          radius={4}
                          checked={r.permissions.view}
                          onChange={(e) => {
                            const arr = [...draft.roles];
                            arr[idx] = {
                              ...arr[idx],
                              permissions: {
                                ...r.permissions,
                                view: e.currentTarget.checked,
                              },
                            };
                            setDraft({ ...draft, roles: arr });
                          }}
                        />
                        <Checkbox
                          label="Sửa"
                          radius={4}
                          checked={r.permissions.edit}
                          onChange={(e) => {
                            const arr = [...draft.roles];
                            arr[idx] = {
                              ...arr[idx],
                              permissions: {
                                ...r.permissions,
                                edit: e.currentTarget.checked,
                              },
                            };
                            setDraft({ ...draft, roles: arr });
                          }}
                        />
                        <Checkbox
                          label="Quản trị"
                          radius={4}
                          checked={r.permissions.manage}
                          onChange={(e) => {
                            const arr = [...draft.roles];
                            arr[idx] = {
                              ...arr[idx],
                              permissions: {
                                ...r.permissions,
                                manage: e.currentTarget.checked,
                              },
                            };
                            setDraft({ ...draft, roles: arr });
                          }}
                        />
                        <ActionIcon
                          color="red"
                          variant="light"
                          radius={4}
                          onClick={() => {
                            const arr = [...draft.roles];
                            arr.splice(idx, 1);
                            setDraft({ ...draft, roles: arr });
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
            <Group>
              <TextInput
                placeholder="Tên vai trò mới"
                value={draft.newRoleLabel}
                onChange={(e) =>
                  setDraft({ ...draft, newRoleLabel: e.currentTarget.value })
                }
                radius={4}
              />
              <Button
                variant="light"
                radius={4}
                leftSection={<IconPlus size={16} />}
                onClick={() => {
                  const label = (draft.newRoleLabel || "").trim();
                  if (!label) return;
                  const slug = label.toLowerCase().replace(/\s+/g, "_");
                  setDraft({
                    ...draft,
                    roles: [
                      ...(draft.roles ?? []),
                      {
                        key: slug,
                        label,
                        permissions: { view: true, edit: false, manage: false },
                        memberCount: 0,
                      },
                    ],
                    newRoleLabel: "",
                  });
                }}
              >
                Thêm vai trò
              </Button>
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

        {which === "archive" && (
          <Stack>
            <Switch
              label={draft.active ? "Đang hoạt động" : "Đã lưu trữ"}
              checked={draft.active}
              onChange={(e) =>
                setDraft({ ...draft, active: e.currentTarget.checked })
              }
            />
            <Textarea
              label="Ghi chú"
              placeholder="Lý do thay đổi trạng thái…"
              minRows={3}
              value={draft.archiveNote}
              onChange={(e) =>
                setDraft({ ...draft, archiveNote: e.currentTarget.value })
              }
              radius={4}
            />
            <Group justify="flex-end">
              <Button variant="default" radius={4} onClick={close}>
                Hủy
              </Button>
              <Button
                color={draft.active ? "green" : "gray"}
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
