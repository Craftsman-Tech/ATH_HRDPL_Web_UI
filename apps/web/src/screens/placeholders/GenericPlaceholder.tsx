/**
 * Generic "coming soon" placeholder for the 5 portals not yet built out.
 * Each will be replaced in its own phase.
 */
import { useAuth } from '../../components/AuthContext';

export default function GenericPlaceholder({ portal }: { portal: string }) {
  const { user, signOut } = useAuth();
  return (
    <div style={{ padding: 48, maxWidth: 720, margin: '0 auto' }}>
      <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.4,
                  color: 'var(--text-muted)', fontWeight: 600 }}>
        {portal} Portal · Coming soon
      </p>
      <h1 className="display" style={{ fontSize: 40, lineHeight: 1.1, marginTop: 8 }}>
        Hello, {user?.name}.
      </h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.6 }}>
        The {portal} Portal will be built in a later phase. Sign-In and auth are working.
      </p>
      <button onClick={signOut} style={{
        marginTop: 24, padding: '10px 18px', borderRadius: 10,
        background: 'var(--text)', color: 'var(--bg)', fontWeight: 600,
      }}>Sign out</button>
    </div>
  );
}
