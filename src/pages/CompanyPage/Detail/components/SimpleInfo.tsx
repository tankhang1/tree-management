import React, { useMemo } from "react";
import {
  Badge,
  Card,
  Divider,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Avatar,
  CopyButton,
  ActionIcon,
  Tooltip,
  Grid,
  ScrollArea,
  rem,
} from "@mantine/core";
import {
  IconBuilding,
  IconHome,
  IconMapPin,
  IconUser,
  IconPhone,
  IconMail,
  IconId,
  IconNote,
  IconTypography,
  IconBuildingBank,
  IconAffiliate,
  IconHeartHandshake,
  IconTruck,
  IconCheck,
  IconCopy,
  IconCalendar,
  IconSitemap,
} from "@tabler/icons-react";

/**
 * UI chi tiết theo nhóm (group-by-group) với dữ liệu mẫu đã điền sẵn.
 * Dùng tốt cho trang Xem chi tiết sau khi tạo, hoặc modal Review.
 */

export default function SimpleInfo() {
  // ----- DỮ LIỆU MẪU (thay bằng dữ liệu thực tế của bạn) -----
  const data = {
    type: "Doanh nghiệp", // Doanh nghiệp | Nông hộ | Hợp tác xã
    code: "DN-ABC-2025-001",
    name: "Công ty TNHH ABC",
    brand: "ABC Mart",
    representative: "Nguyễn Văn A",
    phone: "+84 912 345 678",
    email: "contact@abcmart.vn",
    address: "Số 10, Đường Hoa Sữa, P.7, Q.Phú Nhuận, TP.HCM",
    category: "Khách hàng",
    note: "Khách hàng chiến lược khu vực miền Nam.",
    taxCode: "0312345678",
    taxAddress: "Tầng 5, 25B Nguyễn Thị Minh Khai, Q.1, TP.HCM",
    createdAt: "2025-08-10",
    updatedAt: "2025-08-15",
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
        address: "Thủ Đức, TP.HCM",
        note: "Phụ trách hoá đơn & công nợ",
      },
    ],
    relations: ["Khách hàng", "Đối tác"],
  };

  // Tính nhãn & màu cho loại hình
  const typeBadge = useMemo(() => {
    switch (data.type) {
      case "Doanh nghiệp":
        return { color: "blue", icon: <IconBuilding size={14} /> };
      case "Nông hộ":
        return { color: "teal", icon: <IconHome size={14} /> };
      default:
        return { color: "violet", icon: <IconAffiliate size={14} /> };
    }
  }, [data.type]);

  const categoryBadge = useMemo(() => {
    switch (data.category) {
      case "Khách hàng":
        return { color: "green", icon: <IconUser size={14} /> };
      case "Đối tác":
        return { color: "indigo", icon: <IconHeartHandshake size={14} /> };
      case "Nhà cung cấp":
        return { color: "orange", icon: <IconTruck size={14} /> };
      case "Ngân hàng":
        return { color: "cyan", icon: <IconBuildingBank size={14} /> };
      default:
        return { color: "gray", icon: <IconSitemap size={14} /> };
    }
  }, [data.category]);

  const Section = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <Card withBorder radius={4} p="lg" shadow="sm">
      <Group gap="xs" mb="sm">
        <ThemeIcon variant="light" size={30} radius="xl">
          {icon}
        </ThemeIcon>
        <Title order={5}>{title}</Title>
      </Group>
      {children}
    </Card>
  );

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <Stack gap={2}>
      <Text c="dimmed" size="xs">
        {label}
      </Text>
      <Group gap={6} wrap="nowrap">
        <Text>{value || "—"}</Text>
      </Group>
    </Stack>
  );

  const Copyable = ({ text }: { text: string }) => (
    <CopyButton value={text} timeout={1200}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Đã copy" : "Copy"}>
          <ActionIcon variant="subtle" onClick={copy}>
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );

  return (
    <Stack gap={"xs"} mt={"md"}>
      {/* Header */}
      <Group align="flex-start" justify="space-between" mb="md" wrap="nowrap">
        <Group>
          <Avatar radius="xl" size={48} color="blue">
            {data.name?.slice(0, 2).toUpperCase()}
          </Avatar>
          <Stack gap={2}>
            <Group gap={8}>
              <Title order={3}>{data.name}</Title>
              <Badge color={typeBadge.color} leftSection={typeBadge.icon}>
                {data.type}
              </Badge>
              <Badge
                color={categoryBadge.color}
                leftSection={categoryBadge.icon}
              >
                {data.category}
              </Badge>
            </Group>
            <Group gap={10} c="dimmed">
              <Group gap={6}>
                <IconId size={14} />
                <Text size="sm">{data.code}</Text> <Copyable text={data.code} />
              </Group>
              <Divider orientation="vertical" />
              <Group gap={6}>
                <IconCalendar size={14} />
                <Text size="sm">Tạo: {data.createdAt}</Text>
              </Group>
              <Group gap={6}>
                <IconCalendar size={14} />
                <Text size="sm">Cập nhật: {data.updatedAt}</Text>
              </Group>
            </Group>
          </Stack>
        </Group>
      </Group>

      <Grid gutter="md">
        {/* CỘT TRÁI */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <Section title="Thông tin cơ bản" icon={<IconBuilding size={18} />}>
              <Group mb={"md"}>
                {data.relations.map((r) => (
                  <Badge key={r} variant="light">
                    {r}
                  </Badge>
                ))}
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Field label="Thương hiệu" value={data.brand} />
                <Field label="Người đại diện" value={data.representative} />
                <Group align="flex-end" gap={12}>
                  <Field label="Số điện thoại" value={data.phone} />
                  <Copyable text={data.phone} />
                </Group>
                <Group align="flex-end" gap={12}>
                  <Field label="Email" value={data.email} />
                  <Copyable text={data.email} />
                </Group>
                <Group gap={8}>
                  <ThemeIcon variant="light" radius="xl">
                    <IconMapPin size={16} />
                  </ThemeIcon>
                  <Field label="Địa chỉ" value={data.address} />
                </Group>
              </SimpleGrid>
            </Section>

            <Section title="Thông tin thuế" icon={<IconId size={18} />}>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Group align="flex-end" gap={12}>
                  <Field label="Mã số thuế" value={data.taxCode} />
                  <Copyable text={data.taxCode} />
                </Group>
                <Field label="Địa chỉ thuế" value={data.taxAddress} />
              </SimpleGrid>
              <Divider my="sm" />
              <Field label="Ghi chú" value={data.note} />
            </Section>

            <Section title="Địa chỉ đã lưu" icon={<IconMapPin size={18} />}>
              <ScrollArea h={160} type="always" offsetScrollbars>
                <Group wrap="nowrap" align="flex-start">
                  {data.addresses.map((a) => (
                    <Card
                      key={a.id}
                      withBorder
                      radius={4}
                      p="md"
                      miw={300}
                      style={{
                        borderTop: `${rem(
                          4
                        )} solid var(--mantine-color-green-6)`,
                      }}
                    >
                      <Stack gap={6}>
                        <Group justify="space-between">
                          <Title order={6}>{a.recipientName}</Title>
                          <Badge size="sm" variant="light">
                            Địa chỉ
                          </Badge>
                        </Group>
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
            </Section>
          </Stack>
        </Grid.Col>

        {/* CỘT PHẢI */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <Section title="Chi nhánh" icon={<IconBuilding size={18} />}>
              <ScrollArea h={220} type="auto" offsetScrollbars>
                <Group wrap="nowrap" align="stretch">
                  {data.branches.map((b, i) => (
                    <Card key={i} withBorder radius={4} p="md" miw={320}>
                      <Stack gap={6}>
                        <Group justify="space-between">
                          <Title order={6}>{b.name}</Title>
                          <Badge variant="light">#{i + 1}</Badge>
                        </Group>
                        <List spacing={4} size="sm" center>
                          <List.Item
                            icon={
                              <ThemeIcon size={18} radius="xl" variant="light">
                                <IconPhone size={14} />
                              </ThemeIcon>
                            }
                          >
                            {b.phone}
                          </List.Item>
                          <List.Item
                            icon={
                              <ThemeIcon size={18} radius="xl" variant="light">
                                <IconMail size={14} />
                              </ThemeIcon>
                            }
                          >
                            {b.email}
                          </List.Item>
                          <List.Item
                            icon={
                              <ThemeIcon size={18} radius="xl" variant="light">
                                <IconMapPin size={14} />
                              </ThemeIcon>
                            }
                          >
                            {b.address}
                          </List.Item>
                          <List.Item
                            icon={
                              <ThemeIcon size={18} radius="xl" variant="light">
                                <IconId size={14} />
                              </ThemeIcon>
                            }
                          >
                            MST: {b.taxCode}
                          </List.Item>
                          <List.Item
                            icon={
                              <ThemeIcon size={18} radius="xl" variant="light">
                                <IconTypography size={14} />
                              </ThemeIcon>
                            }
                          >
                            Địa chỉ thuế: {b.taxAddress}
                          </List.Item>
                          <List.Item
                            icon={
                              <ThemeIcon size={18} radius="xl" variant="light">
                                <IconNote size={14} />
                              </ThemeIcon>
                            }
                          >
                            {b.note}
                          </List.Item>
                        </List>
                      </Stack>
                    </Card>
                  ))}
                </Group>
              </ScrollArea>
            </Section>

            <Section
              title="Tài khoản ngân hàng"
              icon={<IconBuildingBank size={18} />}
            >
              <Stack gap="sm">
                {data.banks.map((b, i) => (
                  <Card key={i} withBorder radius={4} p="md">
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={6}>
                        <Group gap={8}>
                          <ThemeIcon variant="light" radius="xl">
                            <IconBuildingBank size={16} />
                          </ThemeIcon>
                          <Title order={6}>{b.bank}</Title>
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
                      <Badge variant="light">#{i + 1}</Badge>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Section>

            <Section title="Liên hệ" icon={<IconUser size={18} />}>
              <Stack gap="sm">
                {data.contacts.map((c, i) => (
                  <Card key={i} withBorder radius={4} p="md">
                    <Group align="flex-start" justify="space-between">
                      <Group>
                        <Avatar radius="xl" color="teal">
                          {c.name[0]}
                        </Avatar>
                        <Stack gap={4}>
                          <Title order={6}>{c.name}</Title>
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
                      <Badge variant="light">{c.role}</Badge>
                    </Group>
                    <Divider my="sm" />
                    <SimpleGrid cols={{ base: 1, sm: 3 }}>
                      <Field label="Phòng ban" value={c.organization} />
                      <Field label="Địa chỉ" value={c.address} />
                      <Field label="Ghi chú" value={c.note} />
                    </SimpleGrid>
                  </Card>
                ))}
              </Stack>
            </Section>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
