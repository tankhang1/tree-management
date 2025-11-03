import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  FileButton,
  Grid,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandZulip,
  IconDeviceFloppy,
  IconEdit,
  IconHome,
  IconLock,
  IconMail,
  IconPhone,
  IconPlus,
  IconSend2,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault?: boolean;
};

type TicketStatus = "processing" | "done";
type Ticket = {
  id: string;
  content: string;
  createdAt: string;
  status: TicketStatus;
};

const STATUS_LABEL: Record<TicketStatus, string> = {
  processing: "Đang xử lý",
  done: "Hoàn tất",
};
const STATUS_COLOR: Record<TicketStatus, string> = {
  processing: "yellow",
  done: "teal",
};

const hotline = "0919090084";
const zalo = "0919090084";

const initialUser = {
  name: "Trung Nguyen",
  email: "trung@example.com",
  phone: "0919090084",
  avatar:
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80&auto=format&fit=crop",
  bio: "Khách hàng thân thiết MV SHOP.",
};

const initialAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Nhà riêng",
    fullName: "Trung Nguyen",
    phone: "0919090084",
    address: "PJICO TOWER, 186 Điện Biên Phủ",
    city: "Hồ Chí Minh",
    district: "Quận 3",
    ward: "Phường 6",
    isDefault: true,
  },
];

const initialTickets: Ticket[] = [
  {
    id: "TIC-1001",
    content: "Giao nhầm sản phẩm",
    createdAt: "2025-07-26 10:45",
    status: "processing",
  },
];

const GlassCard = (props: any) => (
  <Paper
    radius="lg"
    p="lg"
    withBorder
    style={{
      backdropFilter: "saturate(1.2) blur(6px)",
      borderColor: "rgba(0,0,0,0.06)",
    }}
    {...props}
  />
);

const SectionTitle = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Group gap="xs" mb="sm">
    <ThemeIcon radius="xl" variant="light">
      {icon}
    </ThemeIcon>
    <Title order={5}>{children}</Title>
  </Group>
);

const ProfileSupportPage = () => {
  const [avatar, setAvatar] = useState<string | null>(initialUser.avatar);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const [addrModal, addrModalHandlers] = useDisclosure(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);

  const [filter, setFilter] = useState<"all" | TicketStatus>("all");

  const profileForm = useForm({
    initialValues: {
      name: initialUser.name,
      email: initialUser.email,
      phone: initialUser.phone,
      bio: initialUser.bio,
    },
    validate: {
      name: (v) => (!v.trim() ? "Nhập họ tên" : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Email không hợp lệ"),
      phone: (v) => (/^[0-9]{9,11}$/.test(v) ? null : "SĐT không hợp lệ"),
    },
  });

  const passwordForm = useForm({
    initialValues: { current: "", next: "", confirm: "" },
    validate: {
      current: (v) => (!v ? "Nhập mật khẩu hiện tại" : null),
      next: (v) => (v.length < 6 ? "Tối thiểu 6 ký tự" : null),
      confirm: (v, values) =>
        v !== values.next ? "Xác nhận không khớp" : null,
    },
  });

  const addrForm = useForm<Address>({
    initialValues: {
      id: "",
      label: "",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      isDefault: false,
    },
    validate: {
      label: (v) => (!v ? "Nhập nhãn" : null),
      fullName: (v) => (!v ? "Nhập tên người nhận" : null),
      phone: (v) => (/^[0-9]{9,11}$/.test(v) ? null : "SĐT không hợp lệ"),
      address: (v) => (!v ? "Nhập địa chỉ" : null),
      city: (v) => (!v ? "Chọn Tỉnh/TP" : null),
      district: (v) => (!v ? "Chọn Quận/Huyện" : null),
      ward: (v) => (!v ? "Chọn Phường/Xã" : null),
    },
  });

  const defaultAddr = useMemo(
    () => addresses.find((a) => a.isDefault),
    [addresses]
  );

  const saveProfile = profileForm.onSubmit(() => {});
  const changePassword = passwordForm.onSubmit(() => {
    passwordForm.reset();
  });

  const addAddress = () => {
    setEditingAddr(null);
    addrForm.reset();
    addrModalHandlers.open();
  };
  const editAddress = (addr: Address) => {
    setEditingAddr(addr);
    addrForm.setValues(addr);
    addrModalHandlers.open();
  };
  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };
  const submitAddress = addrForm.onSubmit((vals) => {
    if (editingAddr) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddr.id ? { ...editingAddr, ...vals } : a
        )
      );
    } else {
      const id = "addr-" + Math.random().toString(36).slice(2, 8);
      setAddresses((prev) => [...prev, { ...vals, id }]);
    }
    if (vals.isDefault) {
      const id =
        editingAddr?.id ?? addresses[addresses.length - 1]?.id ?? "temp";
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
    }
    addrModalHandlers.close();
    setEditingAddr(null);
  });
  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const filteredTickets = tickets.filter((t) =>
    filter === "all" ? true : t.status === filter
  );

  return (
    <Box
      style={{
        background:
          "radial-gradient(1200px 400px at 10% -10%, rgba(99,102,241,0.15), transparent), radial-gradient(800px 300px at 100% 0%, rgba(16,185,129,0.15), transparent)",
        minHeight: "100vh",
      }}
    >
      <Container size="lg" py="xl">
        <Paper
          radius="lg"
          p="lg"
          mb="lg"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.12))",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Group justify="space-between" align="center">
            <Group>
              <ThemeIcon variant="light" size="xl" radius="xl">
                <IconUser />
              </ThemeIcon>
              <Stack gap={2}>
                <Title order={3}>Tài khoản & Hỗ trợ</Title>
                <Text c="dimmed" size="sm">
                  Quản lý thông tin cá nhân và gửi yêu cầu hỗ trợ khi cần thiết
                </Text>
              </Stack>
            </Group>
            <Group gap="xs" visibleFrom="sm">
              <Button
                component="a"
                href={`tel:${hotline}`}
                variant="gradient"
                gradient={{ from: "blue", to: "teal" }}
                leftSection={<IconPhone size={16} />}
              >
                Gọi {hotline}
              </Button>
              <Button
                component="a"
                href={`https://zalo.me/${zalo}`}
                target="_blank"
                variant="light"
                leftSection={<IconBrandZulip size={16} />}
              >
                Zalo
              </Button>
            </Group>
          </Group>
        </Paper>

        <Grid gutter="lg" align="stretch">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack pos="sticky" top={16} gap="lg">
              <GlassCard>
                <Stack align="center" gap="md">
                  <Avatar src={avatar} size={120} radius="xl" />
                  <Group gap="xs">
                    <FileButton
                      onChange={(file) => {
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () =>
                          setAvatar(reader.result as string);
                        reader.readAsDataURL(file);
                      }}
                      accept="image/*"
                    >
                      {(props) => (
                        <Button
                          variant="light"
                          leftSection={<IconUser size={16} />}
                          {...props}
                        >
                          Đổi ảnh
                        </Button>
                      )}
                    </FileButton>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => setAvatar(null)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                  <Divider w="100%" />
                  <Stack w="100%" gap={8}>
                    <Group gap={8}>
                      <IconUser size={16} />
                      <Text fw={600}>{profileForm.values.name}</Text>
                    </Group>
                    <Group gap={8}>
                      <IconMail size={16} />
                      <Text c="dimmed">{profileForm.values.email}</Text>
                    </Group>
                    <Group gap={8}>
                      <IconPhone size={16} />
                      <Text c="dimmed">{profileForm.values.phone}</Text>
                    </Group>
                  </Stack>
                </Stack>
              </GlassCard>

              <GlassCard>
                <SectionTitle icon={<IconHome size={16} />}>
                  Địa chỉ mặc định
                </SectionTitle>
                {defaultAddr ? (
                  <Stack gap={6}>
                    <Group gap={8}>
                      <Badge color="blue">{defaultAddr.label}</Badge>
                      <Badge color="teal">Default</Badge>
                    </Group>
                    <Text size="sm" fw={600}>
                      {defaultAddr.fullName} • {defaultAddr.phone}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {defaultAddr.address}, {defaultAddr.ward},{" "}
                      {defaultAddr.district}, {defaultAddr.city}
                    </Text>
                    <Anchor size="sm" onClick={() => editAddress(defaultAddr)}>
                      Chỉnh sửa
                    </Anchor>
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    Chưa có địa chỉ mặc định
                  </Text>
                )}
              </GlassCard>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <GlassCard>
              <Tabs
                defaultValue="profile"
                variant="pills"
                radius="md"
                keepMounted={false}
              >
                <Tabs.List grow>
                  <Tabs.Tab
                    value="profile"
                    leftSection={<IconEdit size={16} />}
                  >
                    Thông tin
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="password"
                    leftSection={<IconLock size={16} />}
                  >
                    Mật khẩu
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="addresses"
                    leftSection={<IconHome size={16} />}
                  >
                    Địa chỉ
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="support"
                    leftSection={<IconSend2 size={16} />}
                  >
                    Hỗ trợ
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="profile" pt="md">
                  <Stack gap="md">
                    <SectionTitle icon={<IconEdit size={16} />}>
                      Chỉnh sửa thông tin
                    </SectionTitle>
                    <Group grow>
                      <TextInput
                        label="Họ và tên"
                        {...profileForm.getInputProps("name")}
                      />
                      <TextInput
                        label="Số điện thoại"
                        {...profileForm.getInputProps("phone")}
                      />
                    </Group>
                    <TextInput
                      label="Email"
                      {...profileForm.getInputProps("email")}
                    />
                    <Textarea
                      label="Giới thiệu ngắn"
                      minRows={3}
                      autosize
                      {...profileForm.getInputProps("bio")}
                    />
                    <Group
                      style={{
                        position: "sticky",
                        bottom: -16,
                        paddingTop: 8,
                        background:
                          "linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0))",
                      }}
                      justify="flex-end"
                    >
                      <Button
                        variant="gradient"
                        gradient={{ from: "indigo", to: "teal" }}
                        leftSection={<IconDeviceFloppy size={16} />}
                        onClick={profileForm.onSubmit(() => {})}
                      >
                        Lưu thay đổi
                      </Button>
                    </Group>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="password" pt="md">
                  <Stack gap="md">
                    <SectionTitle icon={<IconLock size={16} />}>
                      Đổi mật khẩu
                    </SectionTitle>
                    <TextInput
                      type="password"
                      label="Mật khẩu hiện tại"
                      {...passwordForm.getInputProps("current")}
                    />
                    <Group grow>
                      <TextInput
                        type="password"
                        label="Mật khẩu mới"
                        {...passwordForm.getInputProps("next")}
                      />
                      <TextInput
                        type="password"
                        label="Xác nhận mật khẩu"
                        {...passwordForm.getInputProps("confirm")}
                      />
                    </Group>
                    <Group justify="flex-end">
                      <Button
                        variant="gradient"
                        gradient={{ from: "violet", to: "cyan" }}
                        leftSection={<IconDeviceFloppy size={16} />}
                        onClick={passwordForm.onSubmit(() =>
                          passwordForm.reset()
                        )}
                      >
                        Cập nhật
                      </Button>
                    </Group>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="addresses" pt="md">
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <SectionTitle icon={<IconHome size={16} />}>
                        Địa chỉ giao hàng
                      </SectionTitle>
                      <Button
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={addAddress}
                      >
                        Thêm địa chỉ
                      </Button>
                    </Group>

                    <Stack>
                      {addresses.map((a) => (
                        <Paper key={a.id} withBorder radius="md" p="md">
                          <Group justify="space-between" align="flex-start">
                            <Stack gap={4}>
                              <Group gap={8}>
                                <Badge color="blue">{a.label}</Badge>
                                {a.isDefault && (
                                  <Badge color="teal">Default</Badge>
                                )}
                              </Group>
                              <Text fw={600}>
                                {a.fullName} • {a.phone}
                              </Text>
                              <Text c="dimmed" size="sm">
                                {a.address}, {a.ward}, {a.district}, {a.city}
                              </Text>
                            </Stack>
                            <Group>
                              {!a.isDefault && (
                                <Button
                                  size="compact-md"
                                  variant="light"
                                  onClick={() => setDefaultAddress(a.id)}
                                >
                                  Đặt mặc định
                                </Button>
                              )}
                              <ActionIcon
                                variant="subtle"
                                onClick={() => editAddress(a)}
                              >
                                <IconEdit size={18} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() => deleteAddress(a.id)}
                              >
                                <IconTrash size={18} />
                              </ActionIcon>
                            </Group>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="support" pt="md">
                  <Stack gap="lg">
                    <Paper radius="md" p="md" withBorder>
                      <Group justify="space-between" mb="sm">
                        <SectionTitle icon={<IconSend2 size={16} />}>
                          Tạo phiếu hỗ trợ
                        </SectionTitle>
                        <Group gap="xs">
                          <Tooltip label={`Gọi ${hotline}`}>
                            <Button
                              component="a"
                              href={`tel:${hotline}`}
                              variant="light"
                              leftSection={<IconPhone size={16} />}
                            >
                              Hotline
                            </Button>
                          </Tooltip>
                          <Tooltip label={`Nhắn Zalo ${zalo}`}>
                            <Button
                              component="a"
                              href={`https://zalo.me/${zalo}`}
                              target="_blank"
                              variant="light"
                              leftSection={<IconBrandZulip size={16} />}
                            >
                              Zalo
                            </Button>
                          </Tooltip>
                        </Group>
                      </Group>
                      <Stack gap="sm">
                        <Select
                          label="Loại vấn đề"
                          placeholder="Chọn loại"
                          data={[
                            { value: "giao_nham", label: "Giao nhầm sản phẩm" },
                            {
                              value: "thieu_hang",
                              label: "Thiếu hàng/Phụ kiện",
                            },
                            { value: "khac", label: "Khác" },
                          ]}
                          searchable
                          nothingFoundMessage="Không có lựa chọn"
                        />
                        <Textarea
                          label="Nội dung"
                          placeholder='VD: "Giao nhầm sản phẩm"'
                          minRows={3}
                          autosize
                        />
                        <Group justify="flex-end">
                          <Button
                            variant="gradient"
                            gradient={{ from: "teal", to: "lime" }}
                          >
                            Gửi
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>

                    <Paper radius="md" p="md" withBorder>
                      <Group justify="space-between" mb="sm">
                        <Title order={5}>Danh sách phiếu hỗ trợ</Title>
                        <Box className="">
                          <Chip value="all">Tất cả</Chip>
                          <Chip value="processing">Đang xử lý</Chip>
                          <Chip value="done">Hoàn tất</Chip>
                        </Box>
                      </Group>
                      <Table
                        highlightOnHover
                        withRowBorders={false}
                        verticalSpacing="md"
                        style={{ borderRadius: 12, overflow: "hidden" }}
                      >
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Mã phiếu</Table.Th>
                            <Table.Th>Nội dung</Table.Th>
                            <Table.Th>Thời gian</Table.Th>
                            <Table.Th>Trạng thái</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {filteredTickets.length === 0 ? (
                            <Table.Tr>
                              <Table.Td colSpan={4}>
                                <Stack align="center" py="xl">
                                  <Text c="dimmed">Chưa có phiếu hỗ trợ</Text>
                                </Stack>
                              </Table.Td>
                            </Table.Tr>
                          ) : (
                            filteredTickets.map((t) => (
                              <Table.Tr key={t.id}>
                                <Table.Td>{t.id}</Table.Td>
                                <Table.Td>
                                  <Text lineClamp={2}>{t.content}</Text>
                                </Table.Td>
                                <Table.Td>{t.createdAt}</Table.Td>
                                <Table.Td>
                                  <Badge
                                    variant="light"
                                    color={STATUS_COLOR[t.status]}
                                  >
                                    {STATUS_LABEL[t.status]}
                                  </Badge>
                                </Table.Td>
                              </Table.Tr>
                            ))
                          )}
                        </Table.Tbody>
                      </Table>
                    </Paper>
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </GlassCard>
          </Grid.Col>
        </Grid>
      </Container>

      <Modal
        opened={addrModal}
        onClose={() => {
          addrModalHandlers.close();
          setEditingAddr(null);
        }}
        title={editingAddr ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}
        centered
        radius="lg"
        size="lg"
      >
        <Stack gap="md">
          <Group grow>
            <TextInput
              label="Nhãn"
              placeholder="Nhà riêng / Văn phòng"
              {...addrForm.getInputProps("label")}
            />
            <TextInput
              label="Người nhận"
              {...addrForm.getInputProps("fullName")}
            />
          </Group>
          <TextInput
            label="Số điện thoại"
            {...addrForm.getInputProps("phone")}
          />
          <Textarea
            label="Địa chỉ"
            autosize
            minRows={2}
            {...addrForm.getInputProps("address")}
          />
          <Group grow>
            <Select
              label="Tỉnh/TP"
              data={["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"]}
              {...addrForm.getInputProps("city")}
            />
            <Select
              label="Quận/Huyện"
              data={["Quận 1", "Quận 3", "Gò Vấp"]}
              {...addrForm.getInputProps("district")}
            />
            <Select
              label="Phường/Xã"
              data={["Phường 6", "Phường 7", "Phường 4"]}
              {...addrForm.getInputProps("ward")}
            />
          </Group>
          <Group justify="space-between" mt="md">
            <Button variant="default" onClick={addrModalHandlers.close}>
              Huỷ
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "teal" }}
              onClick={addrForm.onSubmit((v) => {
                if (editingAddr) {
                  setAddresses((prev) =>
                    prev.map((a) =>
                      a.id === editingAddr.id ? { ...editingAddr, ...v } : a
                    )
                  );
                } else {
                  const id = "addr-" + Math.random().toString(36).slice(2, 8);
                  setAddresses((prev) => [...prev, { ...v, id }]);
                }
                if (v.isDefault) {
                  const id =
                    editingAddr?.id ??
                    addresses[addresses.length - 1]?.id ??
                    "temp";
                  setAddresses((prev) =>
                    prev.map((a) => ({ ...a, isDefault: a.id === id }))
                  );
                }
                addrModalHandlers.close();
                setEditingAddr(null);
              })}
            >
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default ProfileSupportPage;
