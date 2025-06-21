import { Card, Grid, Group, Stack, Text, Title } from "@mantine/core";

const SellPage = () => {
  return (
    <Stack>
      <Title order={3} mb="md">
        Quản lý Bán hàng
      </Title>
      <Grid gutter="lg">
        {[
          {
            label: "Đơn hàng đang xử lý",
            value: "4",
            color: "yellow.6",
            description:
              "Các đơn hàng đã xác nhận và đang trong quá trình đóng gói/giao hàng.",
            icon: "📦",
          },
          {
            label: "Đơn hàng đã hoàn tất",
            value: "26",
            color: "green.6",
            description:
              "Tổng số đơn hàng đã giao và xác nhận thành công trong tháng.",
            icon: "✅",
          },
          {
            label: "Doanh thu tháng này",
            value: "1.45 tỷ ₫",
            color: "blue.6",
            description: "Tổng giá trị đơn hàng đã hoàn tất trong tháng.",
            icon: "💰",
          },
          {
            label: "Khách hàng mới trong tháng",
            value: "12",
            color: "teal.6",
            description:
              "Khách hàng phát sinh giao dịch lần đầu trong tháng hiện tại.",
            icon: "🧑‍🌾",
          },
          {
            label: "Tỷ lệ huỷ đơn",
            value: "3%",
            color: "red.6",
            description:
              "Tỷ lệ huỷ đơn hàng do lỗi vận hành, tồn kho hoặc lý do khác.",
            icon: "❌",
          },
          {
            label: "Sản phẩm bán chạy nhất",
            value: "Sầu riêng Ri6",
            color: "grape.6",
            description:
              "Sản phẩm có doanh thu cao nhất và được đặt nhiều nhất.",
            icon: "🥭",
          },
          {
            label: "Tổng số đơn hàng tháng này",
            value: "33",
            color: "indigo.6",
            description: "Tổng số đơn hàng từ đầu tháng đến hiện tại.",
            icon: "🧾",
          },
          {
            label: "Khách hàng đang theo dõi",
            value: "7",
            color: "orange.6",
            description:
              "Số khách hàng đã thêm sản phẩm vào danh sách yêu thích.",
            icon: "👀",
          },
          {
            label: "Tổng chiết khấu đã áp dụng",
            value: "38 triệu ₫",
            color: "pink.6",
            description: "Tổng giá trị giảm giá đã khấu trừ cho khách hàng.",
            icon: "🎫",
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
export default SellPage;
