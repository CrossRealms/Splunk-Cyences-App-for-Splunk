import Link from '@splunk/react-ui/Link';

export default function CyencesDocFooter({ location }) {
    return (
        <footer style={{ marginTop: '100px' }}>
            <Link style={{ marginLeft: '20px' }} to={`https://cyences.com/${location}`} openInNewContext>Configuration Documentation</Link>
        </footer>
    );
}
