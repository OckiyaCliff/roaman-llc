import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function DashboardScreen() {
  const [user, setUser] = useState<any>(null)
  const [hotel, setHotel] = useState<any>(null)
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    todayBookings: 0
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      // Get hotel staff record
      const { data: staffRecord } = await supabase
        .from('hotel_staff')
        .select('*, hotels(*)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (staffRecord?.hotels) {
        setHotel(staffRecord.hotels)
        loadStats(staffRecord.hotels.id)
      }
    }
  }

  const loadStats = async (hotelId: string) => {
    // Get room counts
    const { count: totalRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', hotelId)
      .eq('is_active', true)

    const { count: availableRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', hotelId)
      .eq('status', 'available')
      .eq('is_active', true)

    const { count: occupiedRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', hotelId)
      .eq('status', 'occupied')
      .eq('is_active', true)

    // Get today's bookings
    const today = new Date().toISOString().split('T')[0]
    const { count: todayBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', hotelId)
      .gte('created_at', today)

    setStats({
      totalRooms: totalRooms || 0,
      availableRooms: availableRooms || 0,
      occupiedRooms: occupiedRooms || 0,
      todayBookings: todayBookings || 0
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Roaman</h1>
          {hotel && <span className="hotel-name">{hotel.name}</span>}
        </div>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Rooms</h3>
            <p className="stat-value">{stats.totalRooms}</p>
          </div>
          <div className="stat-card available">
            <h3>Available</h3>
            <p className="stat-value">{stats.availableRooms}</p>
          </div>
          <div className="stat-card occupied">
            <h3>Occupied</h3>
            <p className="stat-value">{stats.occupiedRooms}</p>
          </div>
          <div className="stat-card bookings">
            <h3>Today's Bookings</h3>
            <p className="stat-value">{stats.todayBookings}</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-button">Manage Rooms</button>
            <button className="action-button">View Bookings</button>
            <button className="action-button">Check-in Guest</button>
            <button className="action-button">Check-out Guest</button>
          </div>
        </div>
      </main>
    </div>
  )
}
