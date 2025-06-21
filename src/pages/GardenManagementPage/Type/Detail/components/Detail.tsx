// Mantine form layout for "Chi tiết loại cây trồng" (beautified + responsive)
import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Grid,
  Group,
  Box,
  Divider,
  Button,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

const Detail = () => {
  return (
    <Box>
      <Text fz={"h3"} fw={"bold"}>
        Thông tin cơ bản
      </Text>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <TextInput
            label="Loại cây trồng"
            disabled
            value="Sầu riêng"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <TextInput label="Mã nhóm cây trồng" value="01-01" radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <TextInput
            label="Tên nhóm cây trồng"
            value="Sầu riêng Musang King"
            required
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Xuất xứ"
            data={["Việt Nam", "Thái Lan", "Malaysia"]}
            value="Việt Nam"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Nhà cung cấp"
            data={["Huyện Chợ Lách, Tỉnh Bến Tre"]}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Loại hạt giống"
            data={["Sầu riêng Musang King"]}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả thông tin chi tiết"
            radius={4}
            autosize
            minRows={3}
          />
        </Grid.Col>
      </Grid>

      <Divider my="lg" label="Chi tiết loại cây trồng" labelPosition="left" />

      <Text fz={"h4"} fw={"bold"}>
        Chi tiết gieo trồng
      </Text>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <NumberInput label="Số ngày nảy mầm" value={7} radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <NumberInput
            label="Khoảng cách giữa các cây (m)"
            value={8}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <NumberInput
            label="Khoảng cách giữa các hàng (m)"
            value={8}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <NumberInput label="Độ sâu trồng (m)" value={0.6} radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <NumberInput
            label="Chiều cao trung bình (m)"
            value={1.2}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 2 }}>
          <NumberInput label="Tỉ lệ nảy mầm (%)" value={70} radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <NumberInput label="Số hạt giống mỗi lỗ" value={500} radius={4} />
        </Grid.Col>
      </Grid>

      <Text fz={"h4"} fw={"bold"} mt={"lg"}>
        Kỹ thuật trồng trọt
      </Text>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <TextInput
            label="Chi tiết trồng trọt"
            value="Tưới nước 2 ngày/lần"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <TextInput
            label="Chi tiết cắt tỉa"
            value="Cắt tỉa cành khô vào tháng 3"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <NumberInput
            label="Tuổi thọ trung bình (tháng)"
            value={1}
            radius={4}
          />
        </Grid.Col>
      </Grid>
      <Text fz={"h4"} fw={"bold"} mt={"lg"}>
        Khả năng chống chịu
      </Text>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Khả năng chịu hạn"
            data={["Thấp", "Trung bình", "Cao"]}
            value="Thấp"
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Khả năng chịu mặn"
            data={["Thấp", "Trung bình", "Cao"]}
            value="Thấp"
            radius={4}
          />
        </Grid.Col>
      </Grid>

      <Divider
        my="lg"
        label="Thông tin thu hoạch và năng suất"
        labelPosition="left"
      />

      <Text fz={"h4"} fw={"bold"} mt={"lg"}>
        Thu hoạch
      </Text>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <NumberInput label="Số ngày ra hoa" value={35} radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <NumberInput label="Số ngày trưởng thành" value={1095} radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <NumberInput
            label="Số ngày đến lúc thu hoạch"
            value={130}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <DateInput
            label="Dự kiến thu hoạch đầu tiên"
            value={new Date("2025-03-12")}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Select
            label="Phương pháp thu hoạch"
            data={["Thu hái thủ công bằng tay"]}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Select
            label="Cách bảo quản"
            data={["Sử dụng kho lạnh"]}
            radius={4}
          />
        </Grid.Col>
      </Grid>

      <Text fz={"h4"} fw={"bold"} mt={"lg"}>
        Năng
      </Text>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <NumberInput
            label="Sản lượng trung bình (Kg/cây)"
            value={10}
            radius={4}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <NumberInput label="Tỉ lệ hao hụt (%)" value={10} radius={4} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <NumberInput
            label="Doanh thu ước tính (Đồng)"
            value={1500000}
            thousandSeparator
            radius={4}
          />
        </Grid.Col>
      </Grid>

      <Group mt="xl" justify="flex-end">
        <Button variant="outline" color="gray" radius={4}>
          Hủy
        </Button>
        <Button color="green" radius={4}>
          Lưu
        </Button>
      </Group>
    </Box>
  );
};

export default Detail;
