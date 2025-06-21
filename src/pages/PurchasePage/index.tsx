import { Card, Grid, Group, Stack, Text, Title } from "@mantine/core";

const PurchasePage = () => {
  return (
    <Stack>
      <Title order={3} mb="md">
        Quản lý Mua hàng
      </Title>
      <Grid gutter="lg">
        {[
          {
            label: "Đơn hàng chờ duyệt",
            value: "5",
            color: "yellow.6",
            description: "Các yêu cầu mua hàng đang chờ duyệt từ quản lý.",
            icon: "📥",
          },
          {
            label: "Đơn đã đặt tháng này",
            value: "18",
            color: "green.6",
            description: "Tổng số đơn hàng đã được xác nhận từ đầu tháng.",
            icon: "📝",
          },
          {
            label: "Tổng chi phí mua tháng này",
            value: "792 triệu ₫",
            color: "blue.6",
            description: "Tổng giá trị tất cả các đơn hàng đã đặt trong tháng.",
            icon: "💰",
          },
          {
            label: "Nhà cung cấp đang hoạt động",
            value: "9",
            color: "teal.6",
            description: "Số lượng nhà cung cấp có giao dịch trong tháng.",
            icon: "🏢",
          },
          {
            label: "Mặt hàng phổ biến nhất",
            value: "Phân hữu cơ EcoGrow",
            color: "grape.6",
            description: "Loại vật tư được đặt hàng nhiều nhất trong chu kỳ.",
            icon: "🌱",
          },
          {
            label: "Tình trạng tồn kho sắp hết",
            value: "7 mặt hàng",
            color: "red.6",
            description: "Những vật tư sắp dưới mức tồn kho tối thiểu.",
            icon: "⚠️",
          },
          {
            label: "Tổng số đơn đã giao thành công",
            value: "14",
            color: "cyan.6",
            description: "Số lượng đơn hàng đã hoàn tất và được nhận đủ.",
            icon: "📦",
          },
          {
            label: "Tỷ lệ đúng hạn giao hàng",
            value: "93%",
            color: "indigo.6",
            description:
              "Phần trăm đơn hàng được giao đúng lịch hẹn với nhà cung cấp.",
            icon: "⏱️",
          },
          {
            label: "Số đơn bị khiếu nại",
            value: "2",
            color: "orange.6",
            description: "Đơn hàng có phản ánh về chất lượng hoặc chậm trễ.",
            icon: "❗",
          },
          {
            label: "Tổng số mặt hàng đã mua",
            value: "43",
            color: "lime.6",
            description: "Tổng số loại sản phẩm đã đặt trong toàn bộ tháng.",
            icon: "📊",
          },
          {
            label: "Đơn hàng có khuyến mãi",
            value: "6",
            color: "pink.6",
            description: "Đơn hàng có áp dụng mã giảm giá hoặc hỗ trợ chi phí.",
            icon: "🎁",
          },
          {
            label: "Tổng số phiếu nhập kho",
            value: "19",
            color: "gray.6",
            description:
              "Số phiếu xác nhận vật tư đã nhập thành công vào hệ thống.",
            icon: "📄",
          },
        ].map((item, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              withBorder
              shadow="md"
              radius="md"
              p="lg"
              style={{
                transition: "transform 0.2s ease",
              }}
            >
              <Stack gap={6}>
                <Group justify="space-between">
                  <Group gap={6}>
                    <Text size="lg">{item.icon}</Text>
                    <Text fw={600} size="sm" c="gray.7">
                      {item.label}
                    </Text>
                  </Group>
                  <Title order={2} c={item.color} fw={700}>
                    {item.value}
                  </Title>
                </Group>
                <Text size="xs" c="gray.6">
                  {item.description}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
export default PurchasePage;
