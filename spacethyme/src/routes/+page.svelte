<script lang="ts">
    import { pageName } from '$root/lib/stores.js';
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import Paper, { Title, Subtitle, Content } from '@smui/paper';

    pageName.set("");
</script>
<div class="page-content">
    <h1>Welcome to {PUBLIC_SITE_NAME}</h1>

    <p>This is a live demonstration of {PUBLIC_SITE_NAME}.</p>
    <div class="paper-container">
        <Paper variant="outlined">
            <Title>Features</Title>
            <Subtitle>Cool stuff</Subtitle>
            <Content>You can visualize your data on a map!</Content>
        </Paper>
    </div>
</div>