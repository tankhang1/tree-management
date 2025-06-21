import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
  IconCopy,
  IconDownload,
  IconQrcode,
  IconSearch,
  IconShare,
} from "@tabler/icons-react";
import QRCode from "react-qr-code";
import Logo from "../../../../../../assets/logo.avif";
const QR_URL = "https://queenfarm.vn/qc/001/Check";
const Detail = () => {
  const clipboard = useClipboard({ timeout: 1000 });
  return (
    <Stack>
      <Group align="flex-start" mb="lg" wrap="wrap">
        <Stack gap={5}>
          <Paper withBorder radius={4} p={"sm"}>
            <Stack justify="center" align="center">
              <QRCode value="https://queenfarm.vn/qc/001/Check" size={300} />
            </Stack>
          </Paper>

          <Group
            justify="space-between"
            align="center"
            bg="#F2F2F2"
            p={"xs"}
            style={{ borderRadius: 4 }}
          >
            <Text>{QR_URL}</Text>
            <ActionIcon
              variant="light"
              onClick={() => {
                clipboard.copy(QR_URL);
              }}
            >
              <IconCopy size={16} />
            </ActionIcon>
          </Group>
        </Stack>

        <Stack gap={8}>
          <Group justify="space-between">
            <Group>
              <Text fw={500}>Logo:</Text>
              <Switch />
            </Group>
            <Avatar src={Logo} size={40} radius={50} />
          </Group>
          <Button leftSection={<IconQrcode size={16} />} color="green" w={200}>
            In mã
          </Button>
          <Button leftSection={<IconSearch size={16} />} color="green" w={200}>
            Tra cứu
          </Button>
          <Button
            leftSection={<IconDownload size={16} />}
            color="green"
            w={200}
          >
            Tải xuống
          </Button>
          <Button leftSection={<IconShare size={16} />} color="green" w={200}>
            Chia sẻ
          </Button>
        </Stack>
      </Group>

      <Divider label="Thông tin cơ bản" labelPosition="left" my="md" />

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Vùng trồng"
            data={["Vùng trồng A"]}
            defaultValue="Vùng trồng A"
            disabled
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <TextInput
            label="Mã khu vực trồng"
            defaultValue="A"
            required
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <TextInput
            label="Tên khu vực trồng"
            defaultValue="Khu vực A"
            required
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput label="Diện tích (m²)" defaultValue="1000" radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Tổng số lô trong khu vực trồng"
            defaultValue="10"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả thông tin chi tiết"
            autosize
            minRows={3}
            radius={4}
          />
        </Grid.Col>
      </Grid>

      <Divider label="Thông tin chi tiết" labelPosition="left" my="md" />

      <Title order={6} mb="sm">
        Thuộc tính khu vực trồng
      </Title>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Hình thức trồng"
            data={["Nhà kính"]}
            defaultValue="Nhà kính"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Phương pháp trồng"
            data={["Gieo trực tiếp"]}
            defaultValue="Gieo trực tiếp"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Định dạng trồng"
            data={["Trồng theo hàng"]}
            defaultValue="Trồng theo hàng"
            radius={4}
          />
        </Grid.Col>
      </Grid>

      <Title order={6} mt="lg" mb="sm">
        Điều kiện tự nhiên
      </Title>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Select
            label="Loại đất"
            data={["Đất Bazan"]}
            defaultValue="Đất Bazan"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <TextInput label="Độ ẩm (%)" placeholder="Ví dụ: 50, 70" radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <TextInput
            label="Độ pH đất"
            placeholder="Ví dụ: 4.0, 5.7"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <TextInput
            label="Nhiệt độ (C)"
            placeholder="Ví dụ: 5, 37"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <TextInput
            label="Lượng mưa (mm/năm)"
            placeholder="Ví dụ: 2000, 1500"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Select
            label="Nguồn nước ngầm"
            data={["nước ngầm"]}
            placeholder="Ví dụ: nước ngầm"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Select
            label="Tình trạng ánh sáng"
            data={["Ánh sáng ấm"]}
            placeholder="Ví dụ: Ánh sáng ấm"
            radius={4}
          />
        </Grid.Col>
      </Grid>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" color="gray" radius={4}>
          Hủy
        </Button>
        <Button radius={4}>Lưu</Button>
      </Group>
    </Stack>
  );
};
export default Detail;
