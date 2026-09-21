import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react-native';

interface Order {
  id: number;
  order_number: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={20} color="#D99A00" />;
      case 'processing':
        return <Package size={20} color="#173B8F" />;
      case 'shipped':
        return <Truck size={20} color="#9333EA" />;
      case 'delivered':
        return <CheckCircle size={20} color="#1F8A5B" />;
      case 'cancelled':
        return <XCircle size={20} color="#C73E3A" />;
      default:
        return <Package size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FEF3C7';
      case 'processing':
        return '#DBEAFE';
      case 'shipped':
        return '#EDE9FE';
      case 'delivered':
        return '#D1FAE5';
      case 'cancelled':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Package size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
        </View>
      ) : (
        <View style={styles.ordersList}>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  {getStatusIcon(order.status)}
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderNumber}>{order.order_number}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>
              <View style={styles.orderStatus}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </View>
                <Text style={styles.paymentStatus}>
                  Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171A21',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#171A21',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderDetails: {
    gap: 2,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171A21',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#173B8F',
  },
  orderStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171A21',
  },
  paymentStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
});
