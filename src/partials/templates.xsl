<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="storage-list">
	<div class="storage-list">
		<legend><xsl:value-of select="//i18n//*[@name='Default Storage']/@value"/></legend>
		<div class="storage">
			<xsl:attribute name="data-id">defiant-cloud</xsl:attribute>
			<i class="icon-storage"></i>
			<span class="name"><xsl:value-of select="//i18n//*[@name='Defiant Cloud']/@value"/></span>
			<span class="size">
				<xsl:call-template name="sys:storage-size">
					<xsl:with-param name="bytes" select="//FileSystem/@quota" />
				</xsl:call-template>
			</span>
		</div>
		
		<legend class="external"><xsl:value-of select="@name"/></legend>
		<xsl:for-each select="./*">
			<div class="storage">
				<xsl:attribute name="data-id"><xsl:value-of select="@icon"/></xsl:attribute>
				<i>
					<xsl:attribute name="class">icon-<xsl:value-of select="@icon"/></xsl:attribute>
				</i>
				<span class="name"><xsl:value-of select="@name"/></span>
				<span class="size">
					<xsl:call-template name="sys:storage-size">
						<xsl:with-param name="bytes" select="@quota" />
					</xsl:call-template>
				</span>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>

<xsl:template name="storage-details">
	<div class="tab-active_">
		<xsl:if test="@quota">
			<xsl:attribute name="class">tab-active_ connected</xsl:attribute>
		</xsl:if>
		<div class="row-group_">
			<div class="row-cell_ row-status">
				<div>Status:</div>
				<div>
					<i class="indicator"></i>
					<b class="conn-true">Connected</b>
					<b class="conn-working">
						<svg class="loading paused" viewBox="25 25 50 50" >
							<circle class="loader-path" cx="50" cy="50" r="20" />
						</svg>
						Connecting&#8230;
					</b>
					<b class="conn-false">Not connected</b>
					<button data-click="connect-cloud-storage">Connect&#8230;</button>
				</div>
			</div>
		</div>
		<hr/>
		<div class="row-group_ storage-name">
			<div class="row-cell_">
				<div>Name:</div>
				<div>
					<input type="text">
						<xsl:if test="name() = 'FileSystem'">
							<xsl:attribute name="disabled">disabled</xsl:attribute>
						</xsl:if>
						<xsl:attribute name="value"><xsl:choose>
							<xsl:when test="name() = 'FileSystem'">
								<xsl:value-of select="//i18n//*[@name='Defiant Cloud']/@value"/>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select="@name"/></xsl:otherwise>	
						</xsl:choose></xsl:attribute>
					</input>
				</div>
			</div>
		</div>
		<div class="row-group_ storage-type">
			<div class="row-cell_">
				<div>Storage:</div>
				<div>
					<selectbox>
						<option value="google-drive" selected="true">Google Drive</option>
						<option value="dropbox">Dropbox</option>
						<option value="onedrive">OneDrive</option>
					</selectbox>
				</div>
			</div>
		</div>
		<div class="row-group_ disc-usage">
			<div class="row-cell_">
				<div>Usage:</div>
				<div>
					<div class="disc-bar">
						<div style="background: #7676fe; width: 6.0%; "><span>Video</span></div>
						<div style="background: #69a5e1; width: 4.6%; "><span>Audio</span></div>
						<div style="background: #e97474; width: 11.0%; "><span>Documents</span></div>
						<div style="background: #ff9800; width: 21.0%; "><span>Images</span></div>
						<div style="background: #aaa; width: 9.0%; "><span>Other</span></div>
					</div>
					<span>975.4 MB available of 1.0 GB</span>
				</div>
			</div>
		</div>
		<hr/>
		<p>
			<i class="icon-info"></i>
			You can connect a cloud storage, thereby extending available storage. To connect more than one disk storage, you need to upgrade to premium account. Upgrading to premium grants you additional 15 GB of cloud storage.
		</p>
	</div>
</xsl:template>

<xsl:template name="bg-tree">
	<xsl:for-each select="./*">
		<div>
			<xsl:attribute name="class">tree-item</xsl:attribute>
			<xsl:attribute name="data-type"><xsl:value-of select="@type"/></xsl:attribute>
			<span class="icon">
				<xsl:attribute name="style">background-image: url(~/icons/<xsl:choose>
						<xsl:when test="@icon = 'color-wheel'">icon-color-preset</xsl:when>
						<xsl:otherwise>tiny-generic-folder</xsl:otherwise>
					</xsl:choose>.png)</xsl:attribute>
			</span>
			<span class="name"><xsl:value-of select="@name"/></span>
		</div>
	</xsl:for-each>
</xsl:template>

<xsl:template name="bg-list">
	<xsl:for-each select="./*">
		<div>
			<xsl:attribute name="class">bg-preview</xsl:attribute>
			<xsl:attribute name="style"><xsl:value-of select="." disable-output-escaping="yes"/></xsl:attribute>
		</div>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>

