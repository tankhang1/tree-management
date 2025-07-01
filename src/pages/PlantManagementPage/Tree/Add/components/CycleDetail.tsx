import { Card, Text, Title, Stack, List, ThemeIcon } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
const CycleDetail = () => {
  return (
    <Card withBorder radius="md" shadow="sm" p="lg">
      <Stack gap="md">
        <Title order={4}>Thông tin Chu kỳ sinh trưởng</Title>

        <Text>
          <strong>Chu kỳ sinh trưởng</strong> là tập hợp các giai đoạn phát
          triển của cây trồng từ khi bắt đầu gieo trồng cho đến khi thu hoạch.
          Mỗi giống cây có thể có đặc điểm sinh trưởng khác nhau tùy theo điều
          kiện khí hậu, đất đai và kỹ thuật canh tác.
        </Text>

        <Text size="sm" fw={500}>
          Các thông tin cần khai báo:
        </Text>
        <List
          spacing="xs"
          size="sm"
          icon={
            <ThemeIcon color="teal" size={20} radius="xl">
              <IconCircleCheck size={14} />
            </ThemeIcon>
          }
        >
          <List.Item>
            <strong>Giống cây:</strong> Chọn giống cây trồng áp dụng chu kỳ.
          </List.Item>
          <List.Item>
            <strong>Giai đoạn sinh trưởng:</strong> Chọn từ danh sách có sẵn
            hoặc tạo mới nếu chưa có.
          </List.Item>
          <List.Item>
            <strong>Thời gian:</strong> Ghi rõ thời gian bắt đầu và kết thúc của
            từng giai đoạn.
          </List.Item>
          <List.Item>
            <strong>Điều kiện đặc thù:</strong> Mô tả các yếu tố như ánh sáng,
            nước, dinh dưỡng, sâu bệnh, v.v.
          </List.Item>
          <List.Item>
            <strong>Cây:</strong> Gắn với cây cụ thể (nếu quản lý chi tiết đến
            từng cây).
          </List.Item>
          <List.Item>
            <strong>Giai đoạn:</strong> Mô tả tên giai đoạn thực tế như Gieo
            trồng, Ra hoa, Kết trái,...
          </List.Item>
          <List.Item>
            <strong>Mô tả:</strong> Thêm ghi chú hoặc mô tả chi tiết giúp theo
            dõi dễ hơn.
          </List.Item>
          <List.Item>
            <strong>Tài liệu đính kèm:</strong> Có thể đính kèm hình ảnh, tài
            liệu hướng dẫn, biểu đồ,...
          </List.Item>
        </List>

        <Text size="sm" color="dimmed">
          Việc khai báo đầy đủ thông tin chu kỳ giúp theo dõi tiến độ cây trồng,
          lên kế hoạch chăm sóc chính xác và hỗ trợ ra quyết định hiệu quả.
        </Text>
      </Stack>
    </Card>
  );
};

export default CycleDetail;
