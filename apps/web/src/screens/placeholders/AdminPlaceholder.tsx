/**
 * Placeholder shown in /admin until Phase 2 builds the real Admin Portal.
 * Demonstrates auth + sign-out work end-to-end so you can verify the
 * foundation before we move on.
 */
import { useAuth } from '../../components/AuthContext';

export default function AdminPlaceholder() {
  const { user, signOut } = useAuth();
  return (
    <div style={{ padding: 48, maxWidth: 720, margin: '0 auto' }}>
      <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.4,
                  color: 'var(--text-muted)', fontWeight: 600 }}>Phase 1 · Foundation</p>
      <h1 className="display" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 8 }}>
        Welcome, {user?.name}.
      </h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.6, maxWidth: 520 }}>
        Sign-In is wired up. Auth state persists across refreshes. Theme toggle and
        language switcher work. The Admin Portal — sidebar, dashboard, all 9 modules —
        ships in <strong>Phase 2</strong>.
      </p>

      <div style={{ marginTop: 32, padding: 20, background: 'var(--card)',
                    borderRadius: 14, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1,
                      color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10 }}>
          Signed-in user
        </div>
        <div><strong>Name:</strong> {user?.name}</div>
        <div><strong>Email:</strong> {user?.email}</div>
        <div><strong>Role:</strong> {user?.role}</div>
      </div>

      <button onClick={signOut} style={{
        marginTop: 24, padding: '10px 18px', borderRadius: 10,
        background: 'var(--text)', color: 'var(--bg)', fontWeight: 600,
      }}>
        Sign out
      </button>
    </div>
  );
}
