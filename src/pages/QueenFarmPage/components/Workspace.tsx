import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconUpload, IconTrash, IconLock } from "@tabler/icons-react";
import { useState } from "react";

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      fullName: "Phùng Bá Nhật Lâm",
      displayName: "PBNLam",
      phone: "0347402927",
      email: "lam@example.com",
      gender: "Nam",
      dob: new Date(1995, 5, 1),
      address: "123 Đường Quê, Hà Nội",
      citizenId: "012345678912",
      role: "Farmer",
      joinedAt: new Date(2022, 0, 10),
      department: "A001 - Farmer",

      // Workspace fields
      farmName: "ABC Farm",
      farmType: "Nông Nghiệp",
      description:
        "Queenfarm là một trong những nông trại nông nghiệp lớn nhất Việt Nam",
      country: "Việt Nam",
      city: "Hồ Chí Minh",
      postalCode: "711550",
      unit: "Ha",
      area: 56,
      farmAddress: "129 Điện Biên Phủ, P. Bình Thạnh, HCM",
    },
  });

  return (
    <Box px="xl" py="md">
      <Title order={2} mb="lg">
        Thông tin cá nhân
      </Title>

      <Paper withBorder shadow="sm" p="lg" radius="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group align="flex-start" gap="md">
              <Avatar
                radius="md"
                size={80}
                src={
                  avatar ??
                  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                }
              />
              <Stack gap={4}>
                <Text fw={600} fz="lg">
                  {form.values.fullName}
                </Text>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="light"
                    color="green"
                    leftSection={<IconUpload size={14} />}
                    onClick={() =>
                      setAvatar(
                        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png"
                      )
                    }
                  >
                    Tải lên
                  </Button>
                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => setAvatar(null)}
                  >
                    Xoá
                  </Button>
                </Group>
              </Stack>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group justify="flex-end" gap="xs" mt={{ base: "md", md: 0 }}>
              <Button
                variant="outline"
                color="gray"
                leftSection={<IconLock size={14} />}
              >
                Đổi mật khẩu
              </Button>
              <Button color="green" leftSection={<IconUpload size={14} />}>
                Lưu thay đổi
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        <Title order={4} mb="md">
          Thông tin cơ bản
        </Title>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Họ và tên"
              withAsterisk
              {...form.getInputProps("fullName")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Tên hiển thị"
              withAsterisk
              {...form.getInputProps("displayName")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Số điện thoại"
              withAsterisk
              {...form.getInputProps("phone")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Địa chỉ email"
              type="email"
              {...form.getInputProps("email")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Giới tính"
              data={["Nam", "Nữ", "Khác"]}
              {...form.getInputProps("gender")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Ngày sinh"
              value={form.values.dob}
              onChange={(date) =>
                date && form.setFieldValue("dob", new Date(date))
              }
              locale="vi"
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput label="Địa chỉ" {...form.getInputProps("address")} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Số CCCD / CMND"
              {...form.getInputProps("citizenId")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Vai trò"
              data={["Farmer", "Admin", "Kỹ thuật viên"]}
              {...form.getInputProps("role")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Phòng ban"
              data={["A001 - Farmer", "A002 - Admin", "A003 - KT"]}
              {...form.getInputProps("department")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Ngày vào làm"
              value={form.values.joinedAt}
              onChange={(date) =>
                date && form.setFieldValue("joinedAt", new Date(date))
              }
              locale="vi"
            />
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        <Title order={4} mb="md">
          Thông tin trang trại
        </Title>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Tên trang trại"
              withAsterisk
              {...form.getInputProps("farmName")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Loại hình trang trại"
              data={["Nông Nghiệp", "Chăn nuôi", "Thủy sản"]}
              {...form.getInputProps("farmType")}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Mô tả về trang trại"
              autosize
              minRows={2}
              {...form.getInputProps("description")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Quốc gia"
              data={["Việt Nam"]}
              {...form.getInputProps("country")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Thành phố"
              data={["Hồ Chí Minh", "Hà Nội"]}
              {...form.getInputProps("city")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Mã bưu chính"
              {...form.getInputProps("postalCode")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Hệ thống đo lường"
              data={["Ha", "m²"]}
              {...form.getInputProps("unit")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Diện tích"
              type="number"
              {...form.getInputProps("area")}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput label="Địa chỉ" {...form.getInputProps("farmAddress")} />
          </Grid.Col>
        </Grid>
      </Paper>
    </Box>
  );
}
